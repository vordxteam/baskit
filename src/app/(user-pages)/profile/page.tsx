"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
    Calendar,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Trash2,
    User,
    X,
    Plus,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { profileApi } from "@/api/profile";
/**
 * Address data structure from backend API
 */
type AddressItem = {
    id: number;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    address_line_1: string;
    address_line_2?: string;
    user_id?: number;
    created_at?: string;
    updated_at?: string;
    // UI display fields
    title: string;
    address: string;
};
import { addressApi } from "@/api/addresses";
type ProfileState = {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
};

// const initialProfile: ProfileState = {
//     name: "Ayesha Khan",
//     email: "ayesha@gmail.com",
//     phone: "+923457876540",
//     dob: "12/12/2012",
//     gender: "Female",
// };
const initialProfile: ProfileState = {
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
};

// Initial empty addresses array - populated from API on mount
const initialAddresses: AddressItem[] = [];

const page = () => {
    const [profile, setProfile] = useState<ProfileState>(initialProfile);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [addresses, setAddresses] = useState<AddressItem[]>(initialAddresses);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [isDeletingAddress, setIsDeletingAddress] = useState(false);
    // const [addressInput, setAddressInput] = useState("");

    const [addressForm, setAddressForm] = useState({
        city: "",
        state: "",
        postal_code: "",
        country: "",
        address_line_1: "",
        address_line_2: "",
    });
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const avatarInputRef = React.useRef<HTMLInputElement>(null);

    const modalTitle = useMemo(() => {
        return editingAddressId ? "Edit your address" : "Add your address";
    }, [editingAddressId]);

    const modalSubtitle = useMemo(() => {
        return editingAddressId
            ? "Update your address for accurate and timely delivery."
            : "Provide your address for accurate and timely delivery.";
    }, [editingAddressId]);

    // const handleProfileChange = (key: keyof ProfileState, value: string) => {
    //     setProfile((prev) => ({ ...prev, [key]: value }));
    // };
    const handleProfileChange = (key: keyof ProfileState, value: string) => {
        setProfile((prev) => ({ ...prev, [key]: value }));
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploadingAvatar(true);
            const res: any = await profileApi.uploadProfileAvatar(file);
            const url = res?.data?.image_url || res?.image_url || null;
            if (url) setAvatarUrl(url);
        } catch (error) {
            console.error("Avatar upload failed:", error);
            alert("Failed to upload avatar. Please try again.");
        } finally {
            setIsUploadingAvatar(false);
            e.target.value = "";
        }
    };

    const handleSaveProfile = async () => {
        try {
            const [firstName, ...rest] = profile.name.trim().split(" ");
            const lastName = rest.join(" ");

            await profileApi.updateProfile({
                first_name: firstName || "",
                last_name: lastName || "",
                phone: profile.phone !== "Null" ? profile.phone : "",
                date_of_birth: profile.dob !== "Null" ? profile.dob : "",
                gender: profile.gender !== "Null" ? profile.gender.toUpperCase() : "",
            } as any);

            setIsEditingProfile(false);
        } catch (error) {
            console.error("Profile update failed:", error);
            alert("Failed to save profile. Please try again.");
        }
    };

    const openAddAddressModal = () => {
        setEditingAddressId(null);

        setAddressForm({
            city: "",
            state: "",
            postal_code: "",
            country: "",
            address_line_1: "",
            address_line_2: "",
        });

        setIsAddressModalOpen(true);
    };

    /**
     * Opens the address modal in edit mode and populates form with existing address data
     * @param item - The address item to edit
     */
    const openEditAddressModal = (item: AddressItem) => {
        setEditingAddressId(item.id);

        // Populate all form fields with the existing address data
        setAddressForm({
            city: item.city || "",
            state: item.state || "",
            postal_code: item.postal_code || "",
            country: item.country || "",
            address_line_1: item.address_line_1 || "",
            address_line_2: item.address_line_2 || "",
        });

        setIsAddressModalOpen(true);
    };

    /**
     * Closes the address modal and resets the form state after a delay
     */
    const closeAddressModal = () => {
        setIsAddressModalOpen(false);

        setTimeout(() => {
            setEditingAddressId(null);

            setAddressForm({
                city: "",
                state: "",
                postal_code: "",
                country: "",
                address_line_1: "",
                address_line_2: "",
            });
        }, 180);
    };

    /**
     * Uses browser geolocation to get current coordinates and fills address_line_1
     */
    // const handleUseCurrentLocation = () => {
    //     if (!navigator.geolocation) {
    //         setAddressForm((prev) => ({
    //             ...prev,
    //             address_line_1: "Current location is not supported on this device.",
    //         }));
    //         return;
    //     }

    //     setIsGettingLocation(true);

    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //             const { latitude, longitude } = position.coords;

    //             setAddressForm((prev) => ({
    //                 ...prev,
    //                 address_line_1: `Current location (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`,
    //             }));

    //             setIsGettingLocation(false);
    //         },
    //         () => {
    //             setAddressForm((prev) => ({
    //                 ...prev,
    //                 address_line_1: "Unable to fetch current location.",
    //             }));

    //             setIsGettingLocation(false);
    //         }
    //     );
    // };

    // browser geo location 
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setIsGettingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                        {
                            headers: {
                                "Accept-Language": "en",
                                "User-Agent": "YourAppName/1.0",
                            },
                        }
                    );

                    const data = await res.json();
                    const a = data.address || {};

                    setAddressForm({
                        city: a.city || a.town || a.village || a.county || "",
                        state: a.state || a.region || "",
                        postal_code: a.postcode || "",
                        country: a.country || "",
                        address_line_1: [a.house_number, a.road].filter(Boolean).join(" "),
                        address_line_2: a.suburb || a.neighbourhood || a.district || "",
                    });
                } catch {
                    alert("Could not fetch address details. Please enter manually.");
                } finally {
                    setIsGettingLocation(false);
                }
            },
            () => {
                alert("Location permission denied. Please allow access and try again.");
                setIsGettingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    /**
     * Fetches user's addresses from the backend API
     * GET /api/addresses/paginated
     */
    const handleFetchAddresses = async () => {
        try {
            setIsLoadingAddresses(true);
            const response: any = await addressApi.getAddresses();

            // Extract addresses from paginated response
            const addressData = response?.data || response || [];

            // Map backend data to AddressItem format with UI display fields
            const mappedAddresses: AddressItem[] = addressData.map((addr: any, index: number) => ({
                ...addr,
                title: `Address ${String(index + 1).padStart(2, "0")}`,
                address: `${addr.address_line_1}${addr.address_line_2 ? ", " + addr.address_line_2 : ""}, ${addr.city}, ${addr.state}, ${addr.country}`,
            }));

            setAddresses(mappedAddresses);
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    /**
     * Saves (creates or updates) an address based on editingAddressId
     * - If editingAddressId exists: calls PUT /api/addresses/{id} to update
     * - If editingAddressId is null: calls POST /api/addresses to create
     */
    const handleSaveAddress = async () => {
        try {
            setIsSavingAddress(true);

            const payload = {
                city: addressForm.city,
                state: addressForm.state,
                postal_code: addressForm.postal_code,
                country: addressForm.country,
                address_line_1: addressForm.address_line_1,
                address_line_2: addressForm.address_line_2,
            };

            if (editingAddressId) {
                // Update existing address
                await addressApi.updateAddress(editingAddressId, payload);
                console.log("Address updated");
            } else {
                // Create new address
                await addressApi.createAddress(payload);
                console.log("Address created");
            }

            // Refresh addresses list to show latest data
            await handleFetchAddresses();
            closeAddressModal();
        } catch (error) {
            console.error("Address save error:", error);
            alert("Failed to save address. Please try again.");
        } finally {
            setIsSavingAddress(false);
        }
    };

    /**
     * Deletes an address permanently by calling the DELETE API
     * On success, refreshes the addresses list
     * @param id - The address ID to delete
     */
    const handleDeleteAddress = async (id: number) => {
        try {
            setIsDeletingAddress(true);
            await addressApi.deleteAddress(id);
            // Refresh addresses list after deletion
            await handleFetchAddresses();
        } catch (error) {
            console.error("Failed to delete address:", error);
            alert("Failed to delete address. Please try again.");
        } finally {
            setIsDeletingAddress(false);
        }
    };

    // profile 
    const { user } = useAuth();

    // Fetch user profile data when user changes
    useEffect(() => {
        if (user?.data) {
            setProfile((prev) => ({
                name: `${user.data.first_name || ""} ${user.data.last_name || ""}`,
                email: user.data.email || "",
                phone: user.data.phone || "Null",
                dob: prev.dob,
                gender: prev.gender,
            }));
        }
    }, [user]);

    // Fetch addresses when component mounts
    useEffect(() => {
        handleFetchAddresses();
    }, []);

    return (

        <div className="min-h-screen bg-[#F4F1E8] text-[#44403C]">
            <div className="mx-auto max-w-[760px] px-5 py-6 sm:px-8 sm:py-8">
                <div className="rounded-none bg-[#F4F1E8]">
                    <div className="flex items-start justify-between gap-4 border-b border-[#DDD8CC] pb-8">
                        <div className="flex items-start gap-4">
                            <div className="relative flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-[#C9C5BC]">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    <User className="h-7 w-7 text-white" strokeWidth={1.8} />
                                )}
                                <button
                                    onClick={() => avatarInputRef.current?.click()}
                                    disabled={isUploadingAvatar}
                                    className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#DDD8CC] bg-[#F4F1E8] transition hover:bg-[#ECE7DC] disabled:opacity-50"
                                >
                                    <Plus className="h-3.5 w-3.5 text-[#6B665E]" strokeWidth={2} />
                                </button>
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                />
                            </div>

                            <div className="pt-0.5">
                                {isEditingProfile ? (
                                    <>
                                        <input
                                            value={profile.name}
                                            onChange={(e) => handleProfileChange("name", e.target.value)}
                                            className="w-full border-b border-[#CFC8BA] bg-transparent pb-1 font-serif text-[18px] font-normal text-[#3A342D] outline-none"
                                        />
                                        {/* <input
                                            value={profile.email}
                                            onChange={(e) => handleProfileChange("email", e.target.value)}
                                            className="mt-1 w-full border-b border-[#E2DCCC] bg-transparent pb-1 text-[14px] text-[#7B7469] outline-none"
                                        /> */}
                                        <p className="mt-1 text-[14px] leading-[18px] text-[#7B7469]">
                                            {profile.email}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h1 className="font-serif text-[18px] leading-[24px] text-[#3A342D]">
                                            {profile.name}
                                        </h1>
                                        <p className="mt-1 text-[14px] leading-[18px] text-[#7B7469]">
                                            {profile.email}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsEditingProfile((prev) => !prev)}
                            className="mt-1 flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[#ECE7DC]"
                        >
                            <Pencil className="h-[15px] w-[15px] text-[#766F64]" strokeWidth={1.8} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 border-b border-[#DDD8CC] py-6 sm:grid-cols-2">
                        <InfoField
                            label="Email"
                            value={profile.email}
                            icon={<Mail className="h-[18px] w-[18px]" strokeWidth={1.6} />}
                            isEditing={false}
                            inputValue={profile.email}
                            onChange={(value) => handleProfileChange("email", value)}
                        />
                        <InfoField
                            label="Phone number"
                            value={profile.phone}
                            icon={<Phone className="h-[18px] w-[18px]" strokeWidth={1.6} />}
                            isEditing={isEditingProfile}
                            inputValue={profile.phone}
                            onChange={(value) => handleProfileChange("phone", value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 border-b border-[#DDD8CC] py-6 sm:grid-cols-2">
                        <InfoField
                            label="Date of birth"
                            value={profile.dob}
                            icon={<Calendar className="h-[18px] w-[18px]" strokeWidth={1.6} />}
                            isEditing={isEditingProfile}
                            inputValue={profile.dob}
                            onChange={(value) => handleProfileChange("dob", value)}
                        />
                        {/* <InfoField
                            label="Gender"
                            value={profile.gender}
                            icon={<User className="h-[18px] w-[18px]" strokeWidth={1.6} />}
                            isEditing={isEditingProfile}
                            inputValue={profile.gender}
                            onChange={(value) => handleProfileChange("gender", value)}
                        /> */}
                        {isEditingProfile ? (
                            <div className="flex items-start justify-between gap-4 px-0 py-4 sm:px-0 sm:py-3">
                                <div className="min-w-0">
                                    <p className="text-[15px] leading-[22px] text-[#4A443C]">Gender</p>
                                    <select
                                        value={profile.gender}
                                        onChange={(e) => handleProfileChange("gender", e.target.value)}
                                        className="mt-1 w-full max-w-[220px] border-b border-[#D8D1C4] bg-transparent pb-1 text-[16px] text-[#7B7469] outline-none cursor-pointer"
                                    >
                                        <option value="" disabled className="bg-[#F4F1E8]">Select gender</option>
                                        <option value="MALE" className="bg-[#F4F1E8]">Male</option>
                                        <option value="FEMALE" className="bg-[#F4F1E8]">Female</option>
                                        <option value="OTHER" className="bg-[#F4F1E8]">Other</option>
                                    </select>
                                </div>
                                <div className="mt-[2px] shrink-0 mr-2 text-[#70695E]">
                                    <User className="h-[18px] w-[18px]" strokeWidth={1.6} />
                                </div>
                            </div>
                        ) : (
                            <InfoField
                                label="Gender"
                                value={profile.gender === "MALE" ? "Male" : profile.gender === "FEMALE" ? "Female" : profile.gender === "OTHER" ? "Other" : profile.gender}
                                icon={<User className="h-[18px] w-[18px]" strokeWidth={1.6} />}
                            />
                        )}
                    </div>

                    <div className="pt-10">
                        <div className="mb-8 flex items-center justify-between gap-4">
                            <h2 className="font-serif text-[22px] leading-[30px] text-[#3A342D]">
                                Address management
                            </h2>

                            <button
                                onClick={addresses.length > 0 ? () => openEditAddressModal(addresses[0]) : openAddAddressModal}
                                className="flex h-[32px] min-w-[50px] items-center justify-center border border-[#6E665B] px-4 text-[18px] leading-none text-[#3F392F] transition hover:bg-[#ECE7DC]"
                            >
                                {addresses.length > 0 ? "Edit" : "Add"}
                            </button>
                        </div>

                        <div className="space-y-0">
                            {addresses.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`flex items-start justify-between gap-4 py-5 ${index !== addresses.length - 1 ? "border-b border-[#DDD8CC]" : ""
                                        }`}
                                >
                                    <div>
                                        <p className="font-serif text-[16px] leading-[28px] text-[#3F392F]">
                                            {item.address}
                                        </p>
                                        <p className="mt-1 text-[15px] leading-[20px] text-[#7E776C]">
                                            {item.title}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 pt-1">
                                        <button
                                            onClick={() => openEditAddressModal(item)}
                                            className="transition hover:opacity-70"
                                        >
                                            <Pencil
                                                className="h-[16px] w-[16px] text-[#7A7368]"
                                                strokeWidth={1.7}
                                            />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAddress(item.id)}
                                            className="transition hover:opacity-70"
                                        >
                                            <Trash2
                                                className="h-[16px] w-[16px] text-[#7A7368]"
                                                strokeWidth={1.7}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {addresses.length === 0 && (
                                <div className="py-10 text-center text-[15px] text-[#7E776C]">
                                    No addresses added yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`fixed inset-0 z-50 transition-all duration-200 ${isAddressModalOpen
                    ? "pointer-events-auto bg-black/35 opacity-100"
                    : "pointer-events-none bg-black/0 opacity-0"
                    }`}
            >
                <div className="flex min-h-screen items-center justify-center p-4">
                    <div
                        className={`w-full max-w-[565px] border border-[#CFC8BA] bg-[#F4F1E8] shadow-[0_10px_40px_rgba(0,0,0,0.18)] transition-all duration-200 ${isAddressModalOpen
                            ? "translate-y-0 scale-100 opacity-100"
                            : "translate-y-3 scale-[0.98] opacity-0"
                            }`}
                    >
                        <div className="relative px-4 pb-5 pt-4 sm:px-6 sm:pb-7 sm:pt-5">
                            <button
                                onClick={closeAddressModal}
                                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[#ECE7DC]"
                            >
                                <X className="h-4 w-4 text-[#6F675D]" />
                            </button>

                            <div className="text-center">
                                <h3 className="font-serif text-[24px] leading-[32px] text-[#3A342D] sm:text-[28px]">
                                    {modalTitle}
                                </h3>
                                <p className="mt-2 text-[14px] leading-[22px] text-[#6E675D] sm:text-[16px]">
                                    {modalSubtitle}
                                </p>
                            </div>

                            <div className="mt-7 overflow-hidden border border-[#D8D1C4] bg-[#E9E7E0]">
                                {/* <div className="relative h-[180px] w-full overflow-hidden sm:h-[214px]">
                                    <div className="absolute inset-0 bg-[#E7E5DF]" />
                                    <div className="absolute left-0 top-0 h-full w-full opacity-95">
                                        <div className="absolute inset-0">
                                            <svg
                                                viewBox="0 0 100 100"
                                                preserveAspectRatio="none"
                                                className="h-full w-full"
                                            >
                                                <rect width="100" height="100" fill="#E8E6E0" />
                                                <path
                                                    d="M0 18 H100 M0 34 H100 M0 50 H100 M0 66 H100 M0 82 H100"
                                                    stroke="#F7F5F1"
                                                    strokeWidth="0.7"
                                                />
                                                <path
                                                    d="M12 0 V100 M28 0 V100 M44 0 V100 M60 0 V100 M76 0 V100 M92 0 V100"
                                                    stroke="#F7F5F1"
                                                    strokeWidth="0.7"
                                                />
                                                <path
                                                    d="M0 20 C12 24, 18 28, 30 28 C42 28, 50 18, 66 16 C80 14, 88 22, 100 18"
                                                    stroke="#E4BF57"
                                                    strokeWidth="2.2"
                                                    fill="none"
                                                />
                                                <path
                                                    d="M0 24 C15 28, 26 31, 36 32 C52 33, 64 28, 78 26 C88 25, 95 28, 100 30"
                                                    stroke="#F2D977"
                                                    strokeWidth="1.1"
                                                    fill="none"
                                                />
                                                <path
                                                    d="M0 67 C16 62, 25 58, 34 60 C44 62, 54 68, 67 69 C80 70, 90 63, 100 59"
                                                    stroke="#9EC5F2"
                                                    strokeWidth="7"
                                                    fill="none"
                                                    opacity="0.8"
                                                />
                                                <path
                                                    d="M10 5 C18 8, 20 15, 25 19 C29 23, 37 22, 40 17"
                                                    stroke="#B9D8B0"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    opacity="0.9"
                                                />
                                            </svg>
                                        </div>

                                        <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
                                            <MapPin
                                                className="h-7 w-7 fill-[#D95C74] text-[#D95C74]"
                                                strokeWidth={1.7}
                                            />
                                        </div>
                                    </div>
                                </div> */}
                            </div>

                            <div className="mt-8 space-y-2">
                                {/* <label className="mb-2 block text-[16px] leading-[22px] text-[#3F392F]">
                                    Address
                                </label>

                                <div className="flex h-[48px] items-center border border-[#D0C9BB] bg-transparent px-3 sm:h-[50px] sm:px-4">
                                    <input
                                        value={addressInput}
                                        onChange={(e) => setAddressInput(e.target.value)}
                                        placeholder="Enter address"
                                        className="h-full flex-1 bg-transparent text-[15px] text-[#4A443C] outline-none placeholder:text-[#958E82]"
                                    />
                                    <MapPin className="h-[18px] w-[18px] text-[#8A8378]" strokeWidth={1.7} />
                                </div> */}


                                <div className="flex h-[48px] items-center border border-[#D0C9BB] bg-transparent px-3 sm:h-[50px] sm:px-4">
                                    <input
                                        value={addressForm.city}
                                        onChange={(e) =>
                                            setAddressForm({ ...addressForm, city: e.target.value })
                                        }
                                        placeholder="City"
                                        className="h-full flex-1 bg-transparent text-[15px] text-[#4A443C] outline-none placeholder:text-[#958E82]"
                                    />
                                    <MapPin className="h-[18px] w-[18px] text-[#8A8378]" strokeWidth={1.7} />
                                </div>
                                <div className="flex h-[48px] items-center border border-[#D0C9BB] bg-transparent px-3 sm:h-[50px] sm:px-4">
                                    <input
                                        value={addressForm.state}
                                        onChange={(e) =>
                                            setAddressForm({ ...addressForm, state: e.target.value })
                                        }
                                        placeholder="State"
                                        className="h-full flex-1 bg-transparent text-[15px] text-[#4A443C] outline-none placeholder:text-[#958E82]"
                                    />
                                    <MapPin className="h-[18px] w-[18px] text-[#8A8378]" strokeWidth={1.7} />
                                </div>
                                <div className="flex h-[48px] items-center border border-[#D0C9BB] bg-transparent px-3 sm:h-[50px] sm:px-4">
                                    <input
                                        value={addressForm.postal_code}
                                        onChange={(e) =>
                                            setAddressForm({ ...addressForm, postal_code: e.target.value })
                                        }

                                        placeholder="Postal code"
                                        className="h-full flex-1 bg-transparent text-[15px] text-[#4A443C] outline-none placeholder:text-[#958E82]"
                                    />
                                    <MapPin className="h-[18px] w-[18px] text-[#8A8378]" strokeWidth={1.7} />
                                </div>
                                <div className="flex h-[48px] items-center border border-[#D0C9BB] bg-transparent px-3 sm:h-[50px] sm:px-4">
                                    <input
                                        value={addressForm.country}
                                        onChange={(e) =>
                                            setAddressForm({ ...addressForm, country: e.target.value })
                                        }
                                        placeholder="Country"
                                        className="h-full flex-1 bg-transparent text-[15px] text-[#4A443C] outline-none placeholder:text-[#958E82]"
                                    />
                                    <MapPin className="h-[18px] w-[18px] text-[#8A8378]" strokeWidth={1.7} />
                                </div>
                                <div className="flex h-[48px] items-center border border-[#D0C9BB] bg-transparent px-3 sm:h-[50px] sm:px-4">
                                    <input
                                        value={addressForm.address_line_1}
                                        onChange={(e) =>
                                            setAddressForm({ ...addressForm, address_line_1: e.target.value })
                                        }
                                        placeholder="Address line 1"
                                        className="h-full flex-1 bg-transparent text-[15px] text-[#4A443C] outline-none placeholder:text-[#958E82]"
                                    />
                                    <MapPin className="h-[18px] w-[18px] text-[#8A8378]" strokeWidth={1.7} />
                                </div>
                                <div className="flex h-[48px] items-center border border-[#D0C9BB] bg-transparent px-3 sm:h-[50px] sm:px-4">
                                    <input
                                        value={addressForm.address_line_2}
                                        onChange={(e) =>
                                            setAddressForm({ ...addressForm, address_line_2: e.target.value })
                                        }

                                        placeholder="Address line 2"
                                        className="h-full flex-1 bg-transparent text-[15px] text-[#4A443C] outline-none placeholder:text-[#958E82]"
                                    />
                                    <MapPin className="h-[18px] w-[18px] text-[#8A8378]" strokeWidth={1.7} />
                                </div>

                                <button
                                    onClick={handleUseCurrentLocation}
                                    className="mx-auto mt-8 block text-center text-[16px] leading-[22px] text-[#E05E73] transition hover:opacity-80"
                                >
                                    {isGettingLocation ? "Getting current location..." : "Use my current location"}
                                </button>

                                <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <button
                                        onClick={closeAddressModal}
                                        className="flex h-[48px] items-center justify-center border border-[#5E574D] bg-transparent text-[17px] text-[#3D382F] transition hover:bg-[#ECE7DC] sm:h-[50px]"
                                    >
                                        Go back
                                    </button>

                                    <button
                                        onClick={handleSaveAddress}
                                        disabled={
                                            isSavingAddress ||
                                            !addressForm.city ||
                                            !addressForm.state ||
                                            !addressForm.country ||
                                            !addressForm.address_line_1
                                        }
                                        className="flex h-[48px] items-center justify-center border border-[#B5B0A5] bg-black text-[17px] text-white transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-90 sm:h-[50px]"
                                    >
                                        {isSavingAddress ? "Saving..." : "Confirm location"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditingProfile && (
                <div className="fixed bottom-5 right-5 z-40">
                    <button
                        onClick={handleSaveProfile}
                        className="rounded-full bg-[#3F392F] px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:opacity-90"
                    >
                        Save profile
                    </button>
                </div>
            )}
        </div>
    );
};

type InfoFieldProps = {
    label: string;
    value: string;
    icon: React.ReactNode;
    isEditing?: boolean;
    inputValue?: string;
    onChange?: (value: string) => void;
};

const InfoField = ({
    label,
    value,
    icon,
    isEditing = false,
    inputValue = "",
    onChange,
}: InfoFieldProps) => {
    return (
        <div className="flex items-start justify-between gap-4 px-0 py-4 sm:px-0 sm:py-3">
            <div className="min-w-0">
                <p className="text-[15px] leading-[22px] text-[#4A443C]">{label}</p>

                {isEditing ? (
                    <input
                        value={inputValue}
                        onChange={(e) => onChange?.(e.target.value)}
                        className="mt-1 w-full max-w-[220px] border-b border-[#D8D1C4] bg-transparent pb-1 text-[16px] text-[#7B7469] outline-none"
                    />
                ) : (
                    <p className="mt-1 text-[16px] leading-[22px] text-[#7B7469]">{value}</p>
                )}
            </div>

            <div className="mt-[2px] shrink-0 mr-2 text-[#70695E]">{icon}</div>
        </div>
    );
};

export default page;