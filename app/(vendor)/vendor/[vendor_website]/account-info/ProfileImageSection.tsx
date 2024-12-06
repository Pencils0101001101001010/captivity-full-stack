"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Camera, Upload, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ProfileActionResult } from "./profile";
import { removeProfileImage, uploadProfileImage } from "./actions";

interface ProfileImageSectionProps {
  profile: ProfileActionResult;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onProfileUpdate: (profile: ProfileActionResult) => void;
}

type ImageType = "avatar" | "background";
type LoadingState = "idle" | "loading" | "success" | "error";

interface ImageState {
  errors: Record<ImageType, boolean>;
  loadingState: Record<ImageType, LoadingState>;
}

interface ImageStateLog {
  url: string | null;
  timestamp: string;
  previousLoadingState: LoadingState;
  newLoadingState: LoadingState;
  duration?: string;
  attempt?: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function ProfileImageSection({
  profile,
  isLoading,
  setIsLoading,
  onProfileUpdate,
}: ProfileImageSectionProps) {
  const [imageState, setImageState] = useState<ImageState>({
    errors: {
      avatar: false,
      background: false,
    },
    loadingState: {
      avatar: "idle",
      background: "idle",
    },
  });

  const retryAttemptsRef = useRef({
    avatar: 0,
    background: 0,
  });

  const updateImageState = useCallback(
    (
      type: ImageType,
      newLoadingState: LoadingState,
      error: boolean = false,
      attempt: number = 0
    ) => {
      const startTime = performance.now();

      setImageState(prev => {
        const previousLoadingState = prev.loadingState[type];
        const url =
          type === "avatar" ? profile.avatarUrl : profile.backgroundUrl;

        const logData: ImageStateLog = {
          url,
          timestamp: new Date().toISOString(),
          previousLoadingState,
          newLoadingState,
          duration: `${(performance.now() - startTime).toFixed(2)}ms`,
          attempt: attempt > 0 ? attempt : undefined,
        };

        if (newLoadingState === "success") {
          console.log(`${type} image loaded successfully:`, logData);
        } else if (newLoadingState === "error") {
          console.error(`Error loading ${type} image:`, logData);
        } else if (newLoadingState === "loading") {
          console.log(`${type} image loading:`, logData);
        }

        return {
          ...prev,
          errors: { ...prev.errors, [type]: error },
          loadingState: { ...prev.loadingState, [type]: newLoadingState },
        };
      });
    },
    [profile.avatarUrl, profile.backgroundUrl]
  );

  const preloadImage = useCallback(async (url: string): Promise<boolean> => {
    return new Promise(resolve => {
      const img = document.createElement("img");
      let timeoutId: NodeJS.Timeout;

      const cleanup = () => {
        img.removeEventListener("load", handleLoad);
        img.removeEventListener("error", handleError);
        clearTimeout(timeoutId);
      };

      const handleLoad = () => {
        cleanup();
        resolve(true);
      };

      const handleError = () => {
        cleanup();
        resolve(false);
      };

      timeoutId = setTimeout(() => {
        cleanup();
        resolve(false);
      }, 10000); // 10 second timeout

      img.addEventListener("load", handleLoad);
      img.addEventListener("error", handleError);
      img.src = url;
    });
  }, []);

  const handleImageError = useCallback(
    async (type: ImageType) => {
      const url = type === "avatar" ? profile.avatarUrl : profile.backgroundUrl;
      if (!url) return;

      const currentAttempt = retryAttemptsRef.current[type];

      if (currentAttempt < MAX_RETRIES) {
        retryAttemptsRef.current[type] = currentAttempt + 1;
        updateImageState(type, "loading", false, currentAttempt + 1);

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));

        // Try to preload the image
        const success = await preloadImage(url);

        if (success) {
          updateImageState(type, "success", false);
          return;
        }
      }

      updateImageState(type, "error", true);
    },
    [profile.avatarUrl, profile.backgroundUrl, preloadImage, updateImageState]
  );

  const handleImageLoad = useCallback(
    (type: ImageType) => {
      retryAttemptsRef.current[type] = 0;
      updateImageState(type, "success", false);
    },
    [updateImageState]
  );

  // Initial image validation
  useEffect(() => {
    const validateImage = async (type: ImageType, url: string | null) => {
      if (!url) return;

      updateImageState(type, "loading", false);
      const success = await preloadImage(url);

      if (success) {
        updateImageState(type, "success", false);
      } else {
        await handleImageError(type);
      }
    };

    if (profile.avatarUrl) {
      validateImage("avatar", profile.avatarUrl);
    }
    if (profile.backgroundUrl) {
      validateImage("background", profile.backgroundUrl);
    }

    // Reset retry attempts when URLs change
    retryAttemptsRef.current = {
      avatar: 0,
      background: 0,
    };
  }, [
    profile.avatarUrl,
    profile.backgroundUrl,
    preloadImage,
    updateImageState,
    handleImageError,
  ]);

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, type: ImageType) => {
      try {
        setIsLoading(true);
        updateImageState(type, "loading", false);
        retryAttemptsRef.current[type] = 0;

        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append(type, file);

        const result = await uploadProfileImage(formData, type);
        if (!result.success) {
          throw new Error(result.error);
        }

        updateImageState(type, "success", false);
        onProfileUpdate(result);
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`
        );
      } catch (error) {
        console.error(`Error uploading ${type} image:`, error);
        updateImageState(type, "error", true);
        toast.error(
          error instanceof Error ? error.message : "Failed to upload image"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, onProfileUpdate, updateImageState]
  );

  const handleImageRemove = useCallback(
    async (type: ImageType) => {
      try {
        setIsLoading(true);
        updateImageState(type, "loading", false);
        retryAttemptsRef.current[type] = 0;

        const result = await removeProfileImage(type);
        if (!result.success) {
          throw new Error(result.error);
        }

        updateImageState(type, "idle", false);
        onProfileUpdate(result);
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully`
        );
      } catch (error) {
        console.error(`Error removing ${type} image:`, error);
        updateImageState(type, "error", true);
        toast.error(
          error instanceof Error ? error.message : "Failed to remove image"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, onProfileUpdate, updateImageState]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Images</CardTitle>
        <CardDescription>
          Update your profile picture and background image
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24">
            {profile.avatarUrl && !imageState.errors.avatar ? (
              <>
                <div className="relative h-24 w-24">
                  <Image
                    src={profile.avatarUrl}
                    alt="Profile Avatar"
                    width={96}
                    height={96}
                    className="rounded-full w-full h-full object-cover"
                    quality={90}
                    priority
                    onError={() => handleImageError("avatar")}
                    onLoad={() => handleImageLoad("avatar")}
                    unoptimized
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 z-10"
                  onClick={() => handleImageRemove("avatar")}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-grow space-y-1">
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => handleImageUpload(e, "avatar")}
              disabled={isLoading}
              className="max-w-xs"
            />
            <p className="text-sm text-muted-foreground">
              Square image recommended, maximum size 2MB
            </p>
          </div>
        </div>

        {/* Background Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg">
            {profile.backgroundUrl && !imageState.errors.background ? (
              <>
                <div className="relative w-full h-full">
                  <Image
                    src={profile.backgroundUrl}
                    alt="Profile Background"
                    width={1920}
                    height={640}
                    className="w-full h-full object-cover"
                    quality={85}
                    priority
                    onError={() => handleImageError("background")}
                    onLoad={() => handleImageLoad("background")}
                    unoptimized
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => handleImageRemove("background")}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="space-y-1">
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => handleImageUpload(e, "background")}
              disabled={isLoading}
              className="max-w-xs"
            />
            <p className="text-sm text-muted-foreground">
              Recommended size 1920x640 pixels, maximum size 5MB
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
