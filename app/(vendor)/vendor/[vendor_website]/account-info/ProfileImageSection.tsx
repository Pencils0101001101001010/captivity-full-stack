"use client";

import { useState, useEffect } from "react";
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

export function ProfileImageSection({
  profile,
  isLoading,
  setIsLoading,
  onProfileUpdate,
}: ProfileImageSectionProps) {
  const [imageErrors, setImageErrors] = useState<{
    avatar: boolean;
    background: boolean;
  }>({ avatar: false, background: false });

  const [imageLoadingState, setImageLoadingState] = useState<{
    avatar: "idle" | "loading" | "success" | "error";
    background: "idle" | "loading" | "success" | "error";
  }>({
    avatar: "idle",
    background: "idle",
  });

  useEffect(() => {
    if (profile) {
      console.log("Profile Image Details:", {
        avatarUrl: profile.avatarUrl,
        backgroundUrl: profile.backgroundUrl,
        avatarLoadingState: imageLoadingState.avatar,
        backgroundLoadingState: imageLoadingState.background,
        timestamp: new Date().toISOString(),
        windowWidth:
          typeof window !== "undefined" ? window.innerWidth : "unknown",
      });
    }
  }, [profile, imageLoadingState]);

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "background"
  ) {
    try {
      const startTime = Date.now();
      console.log(`Starting ${type} image upload`, {
        timestamp: new Date().toISOString(),
        previousState: imageLoadingState[type],
      });

      setIsLoading(true);
      setImageErrors(prev => ({ ...prev, [type]: false }));
      setImageLoadingState(prev => ({ ...prev, [type]: "loading" }));

      const file = event.target.files?.[0];
      if (!file) {
        console.log("No file selected for upload", {
          timestamp: new Date().toISOString(),
        });
        return;
      }

      console.log("Processing file:", {
        type,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        mimeType: file.type,
        timestamp: new Date().toISOString(),
      });

      const formData = new FormData();
      formData.append(type, file);

      const result = await uploadProfileImage(formData, type);
      if (!result.success) {
        throw new Error(result.error);
      }

      const duration = Date.now() - startTime;
      console.log(`${type} image upload successful:`, {
        newUrl: type === "avatar" ? result.avatarUrl : result.backgroundUrl,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      });

      setImageLoadingState(prev => ({ ...prev, [type]: "success" }));
      onProfileUpdate(result);
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`
      );
    } catch (error) {
      console.error(`Error uploading ${type} image:`, {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      });
      setImageLoadingState(prev => ({ ...prev, [type]: "error" }));
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
      setImageErrors(prev => ({ ...prev, [type]: true }));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleImageRemove(type: "avatar" | "background") {
    try {
      const startTime = Date.now();
      console.log(`Starting ${type} image removal`, {
        currentUrl:
          type === "avatar" ? profile.avatarUrl : profile.backgroundUrl,
        timestamp: new Date().toISOString(),
      });

      setIsLoading(true);
      setImageLoadingState(prev => ({ ...prev, [type]: "loading" }));

      const result = await removeProfileImage(type);
      if (!result.success) {
        throw new Error(result.error);
      }

      const duration = Date.now() - startTime;
      console.log(`${type} image removed successfully`, {
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      });

      setImageLoadingState(prev => ({ ...prev, [type]: "idle" }));
      onProfileUpdate(result);
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully`
      );
    } catch (error) {
      console.error(`Error removing ${type} image:`, {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      });
      setImageLoadingState(prev => ({ ...prev, [type]: "error" }));
      toast.error(
        error instanceof Error ? error.message : "Failed to remove image"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageError = (type: "avatar" | "background") => {
    console.error(`Error loading ${type} image:`, {
      url: type === "avatar" ? profile.avatarUrl : profile.backgroundUrl,
      timestamp: new Date().toISOString(),
      loadingState: imageLoadingState[type],
      currentErrors: imageErrors,
      imageWidth: type === "avatar" ? "96px" : "100%",
      windowWidth:
        typeof window !== "undefined" ? window.innerWidth : "unknown",
    });
    setImageErrors(prev => ({ ...prev, [type]: true }));
    setImageLoadingState(prev => ({ ...prev, [type]: "error" }));
  };

  const handleImageLoad = (type: "avatar" | "background") => {
    console.log(`${type} image loaded successfully:`, {
      url: type === "avatar" ? profile.avatarUrl : profile.backgroundUrl,
      timestamp: new Date().toISOString(),
      loadingState: imageLoadingState[type],
      windowWidth:
        typeof window !== "undefined" ? window.innerWidth : "unknown",
    });
    setImageLoadingState(prev => ({ ...prev, [type]: "success" }));
  };

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
            {profile.avatarUrl && !imageErrors.avatar ? (
              <>
                <Image
                  src={profile.avatarUrl}
                  alt="Profile Avatar"
                  className="rounded-full object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 96px, 96px"
                  onError={() => handleImageError("avatar")}
                  onLoad={() => handleImageLoad("avatar")}
                  quality={90}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2"
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
            {profile.backgroundUrl && !imageErrors.background ? (
              <>
                <Image
                  src={profile.backgroundUrl}
                  alt="Profile Background"
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => handleImageError("background")}
                  onLoad={() => handleImageLoad("background")}
                  quality={85}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
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
