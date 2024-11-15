// "use client";

// import { create } from "zustand";
// import {
//   addOfficeLocation,
//   updateOfficeLocation,
//   removeOfficeLocation,
//   updateContactInfo,
//   getOfficeLocations,
// } from "../_actions/office-actions";

// interface OfficeHours {
//   mondayToThursday: string;
//   friday: string;
//   saturdaySunday: string;
//   publicHolidays: string;
// }

// interface OfficeData {
//   city: string;
//   telephone: string;
//   general?: string;
//   websiteQueries?: string;
//   openingHours: {
//     mondayToThursday: string;
//     friday: string;
//     saturdaySunday?: string;
//     publicHolidays?: string;
//   };
// }

// interface Office {
//   id: string;
//   city: string;
//   telephone: string;
//   openingHours: OfficeHours | null;
// }

// interface ContactInfo {
//   generalEmail: string;
//   websiteEmail: string;
//   socialMedia: {
//     facebook?: string;
//     instagram?: string;
//     youtube?: string;
//   };
// }

// interface OfficeStore {
//   offices: Office[];
//   contactInfo: ContactInfo;
//   isLoading: boolean;
//   error: string | null;
//   lastFetch: number;
//   addOffice: (officeData: OfficeData) => Promise<void>;
//   updateOffice: (
//     officeId: string,
//     officeData: Partial<OfficeData>
//   ) => Promise<void>;
//   removeOffice: (officeId: string) => Promise<void>;
//   updateContact: (contactInfo: ContactInfo) => Promise<void>;
//   fetchOfficeLocations: () => Promise<void>;
// }

// const INITIAL_CONTACT_INFO: ContactInfo = {
//   generalEmail: "",
//   websiteEmail: "",
//   socialMedia: {},
// };

// const CACHE_DURATION = 60000; // 1 minute cache
// const DEBOUNCE_DELAY = 300; // 300ms debounce

// export const useOfficeStore = create<OfficeStore>((set, get) => {
//   let debounceTimer: NodeJS.Timeout | null = null;

//   const shouldFetch = () => {
//     const now = Date.now();
//     return !get().lastFetch || now - get().lastFetch > CACHE_DURATION;
//   };

//   const debounce = (fn: Function) => {
//     if (debounceTimer) clearTimeout(debounceTimer);
//     debounceTimer = setTimeout(() => fn(), DEBOUNCE_DELAY);
//   };

//   const updateState = (
//     loading: boolean,
//     error: string | null = null,
//     offices?: Office[],
//     contactInfo?: ContactInfo
//   ) => {
//     const updates: Partial<OfficeStore> = { isLoading: loading };
//     if (error !== undefined) updates.error = error;
//     if (offices !== undefined) updates.offices = offices;
//     if (contactInfo !== undefined) updates.contactInfo = contactInfo;
//     if (offices !== undefined || contactInfo !== undefined) {
//       updates.lastFetch = Date.now();
//     }
//     set(updates);
//   };

//   return {
//     offices: [],
//     contactInfo: INITIAL_CONTACT_INFO,
//     isLoading: false,
//     error: null,
//     lastFetch: 0,

//     addOffice: async (officeData: OfficeData) => {
//       updateState(true, null);
//       try {
//         const result = await addOfficeLocation(officeData);
//         if (!result.success) throw new Error(result.error);
//         updateState(
//           false,
//           null,
//           result.data?.offices,
//           result.data?.contactInfo
//         );
//       } catch (error) {
//         updateState(
//           false,
//           error instanceof Error ? error.message : "Failed to add office"
//         );
//       }
//     },

//     updateOffice: async (officeId: string, officeData: Partial<OfficeData>) => {
//       updateState(true, null);
//       try {
//         const result = await updateOfficeLocation(officeId, officeData);
//         if (!result.success) throw new Error(result.error);

//         // Merge updated office with existing offices
//         const updatedOffices = get().offices.map(office =>
//           office.id === officeId ? result.data!.offices[0] : office
//         );

//         updateState(false, null, updatedOffices, result.data?.contactInfo);
//       } catch (error) {
//         updateState(
//           false,
//           error instanceof Error ? error.message : "Failed to update office"
//         );
//       }
//     },

//     removeOffice: async (officeId: string) => {
//       updateState(true, null);
//       try {
//         const result = await removeOfficeLocation(officeId);
//         if (!result.success) throw new Error(result.error);
//         updateState(
//           false,
//           null,
//           result.data?.offices,
//           result.data?.contactInfo
//         );
//       } catch (error) {
//         updateState(
//           false,
//           error instanceof Error ? error.message : "Failed to remove office"
//         );
//       }
//     },

//     updateContact: async (contactInfo: ContactInfo) => {
//       updateState(true, null);
//       try {
//         const result = await updateContactInfo(contactInfo);
//         if (!result.success) throw new Error(result.error);
//         updateState(
//           false,
//           null,
//           result.data?.offices,
//           result.data?.contactInfo
//         );
//       } catch (error) {
//         updateState(
//           false,
//           error instanceof Error
//             ? error.message
//             : "Failed to update contact info"
//         );
//       }
//     },

//     fetchOfficeLocations: async () => {
//       if (!shouldFetch()) return;

//       const fetch = async () => {
//         if (get().isLoading) return;

//         updateState(true, null);
//         try {
//           const result = await getOfficeLocations();
//           if (!result.success) throw new Error(result.error);
//           updateState(
//             false,
//             null,
//             result.data?.offices,
//             result.data?.contactInfo || INITIAL_CONTACT_INFO
//           );
//         } catch (error) {
//           updateState(
//             false,
//             error instanceof Error ? error.message : "Failed to fetch offices"
//           );
//         }
//       };

//       debounce(fetch);
//     },
//   };
// });

// // Optional: Add selector hooks for better performance
// export const useOffices = () => useOfficeStore(state => state.offices);
// export const useContactInfo = () => useOfficeStore(state => state.contactInfo);
// export const useOfficeLoading = () => useOfficeStore(state => state.isLoading);
// export const useOfficeError = () => useOfficeStore(state => state.error);

// // Example usage:
// // function OfficeComponent() {
// //   const offices = useOffices();
// //   const contactInfo = useContactInfo();
// //   const isLoading = useOfficeLoading();
// //   const error = useOfficeError();
// //   const { addOffice, updateOffice, removeOffice } = useOfficeStore();
// //   ...
// // }
