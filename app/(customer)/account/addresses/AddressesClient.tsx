"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  CustomerAddress,
  CustomerAddressPayload,
  getCustomerAddressesApi,
  createCustomerAddressApi,
  updateCustomerAddressApi,
  deleteCustomerAddressApi,
  setDefaultCustomerAddressApi,
} from "@/lib/api/customerAddress";
import { getPublicDistricts, District } from "@/lib/api/locations";
import { Select } from "@/components/ui/Select";

export function AddressesClient() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [companyName, setCompanyName] = useState("");
  const [label, setLabel] = useState("HOME");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    async function loadDistricts() {
      try {
        const res = await getPublicDistricts();
        if (res.success && res.resources && res.resources.length > 0) {
          setDistricts(res.resources);
          const dhaka = res.resources.find((d) => d.name.toLowerCase() === "dhaka");
          if (dhaka) {
            setCity(dhaka.name);
          }
        }
      } catch (err) {
        console.error("Failed to load districts", err);
      }
    }
    loadDistricts();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await getCustomerAddressesApi();
      if (res.success && res.resources) {
        setAddresses(res.resources);
      } else {
        toast.error(res.message || "Failed to load addresses");
      }
    } catch (error) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        const res = await deleteCustomerAddressApi(id);
        if (res.success) {
          toast.success(res.message || "Address deleted successfully", {
            style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          });
          fetchAddresses();
        } else {
          toast.error(res.message || "Failed to delete address");
        }
      } catch (error) {
        toast.error("An error occurred while deleting the address");
      }
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const res = await setDefaultCustomerAddressApi(id);
      if (res.success) {
        toast.success("Default address updated successfully", {
          style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
          iconTheme: { primary: '#10b981', secondary: '#fff' },
        });
        fetchAddresses();
      } else {
        toast.error(res.message || "Failed to set default address");
      }
    } catch (error) {
      toast.error("An error occurred while updating default address");
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setName("");
    setPhone("");
    setStreetAddress("");
    const dhaka = districts.find((d) => d.name.toLowerCase() === "dhaka");
    setCity(dhaka ? dhaka.name : districts[0]?.name || "Dhaka");
    setCompanyName("");
    setLabel("HOME");
    setIsDefault(addresses.length === 0);
    setIsModalOpen(true);
  };

  const openEditModal = (addr: CustomerAddress) => {
    setEditingAddress(addr);
    setName(addr.name || "");
    setPhone(addr.phone || "");
    setStreetAddress(addr.address || "");
    setCity(addr.city || "Dhaka");
    setCompanyName(addr.company_name || "");
    setLabel(addr.label || "HOME");
    setIsDefault(Boolean(addr.is_default));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: CustomerAddressPayload = {
      name,
      phone,
      address: streetAddress,
      city,
      company_name: companyName || undefined,
      label: label || "HOME",
      is_default: isDefault,
    };

    setSubmitting(true);
    try {
      if (editingAddress) {
        const res = await updateCustomerAddressApi(editingAddress.id, payload);
        if (res.success) {
          toast.success("Address updated successfully", {
            style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          });
          setIsModalOpen(false);
          fetchAddresses();
        } else {
          toast.error(res.message || "Failed to update address");
        }
      } else {
        const res = await createCustomerAddressApi(payload);
        if (res.success) {
          toast.success("Address added successfully", {
            style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          });
          setIsModalOpen(false);
          fetchAddresses();
        } else {
          toast.error(res.message || "Failed to add address");
        }
      }
    } catch (error) {
      toast.error("An error occurred while saving the address");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Address Book</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage your billing and shipping addresses.</p>
          </div>

          <button
            onClick={openAddModal}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-lg shadow-rose-600/20 flex items-center gap-2 text-sm"
          >
            <Plus size={18} />
            Add New Address
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-rose-500" size={36} />
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
            <MapPin size={40} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No addresses found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">You have not added any address yet.</p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors"
            >
              <Plus size={16} />
              Add Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div key={addr.id} className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 relative flex flex-col shadow-sm transition-colors ${addr.is_default ? 'border-rose-300 dark:border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-slate-200 dark:border-slate-800'}`}>
                {addr.is_default && (
                  <div className="absolute -top-3 -right-3 bg-white dark:bg-slate-900 rounded-full">
                    <CheckCircle2 size={24} className="text-rose-500 fill-rose-500/20" />
                  </div>
                )}

                <div className="flex items-start gap-3 mb-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="mt-1">
                    <MapPin size={20} className={addr.is_default ? "text-rose-500 dark:text-rose-400" : "text-slate-400 dark:text-slate-500"} />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {addr.label || "HOME"} {addr.is_default && <span className="text-xs text-rose-500 font-semibold">(Default)</span>}
                      </h3>
                      {addr.company_name && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{addr.company_name}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 flex-1 mb-6">
                  <p className="font-medium text-slate-900 dark:text-white">{addr.name}</p>
                  <p>{addr.address}</p>
                  <p>{addr.city}</p>
                  <p className="pt-2 text-slate-500 dark:text-slate-400">{addr.phone}</p>
                </div>

                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => openEditModal(addr)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  {!addr.is_default && (
                    <>
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium px-2 py-1"
                      >
                        Set Default
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium p-2.5 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Address Modal matching Checkout Modal design */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {editingAddress ? "Edit Delivery Address" : "Add New Delivery Address"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {editingAddress ? "Update your address details below" : "Fill in your shipping details below"}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chonchol Miah"
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>

                {/* Street Address */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Street Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. House 12, Road 4, Block B"
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>

                {/* City / District Select */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    City / District <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-all h-auto min-h-[46px]"
                  >
                    <option value="" disabled>Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} {d.bn_name ? `(${d.bn_name})` : ""}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Company Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Additional Settings Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 pb-1 border-t border-slate-100 dark:border-slate-800/60 mt-1">
                {/* Address Label */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                    Label:
                  </span>
                  <div className="flex gap-2">
                    {["HOME", "WORK", "OFFICE"].map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setLabel(lbl)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          label === lbl
                            ? "bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-500/30"
                            : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-slate-800"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Set as Default Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="is_default_check"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Set as default address
                  </span>
                </label>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Back to List
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 disabled:opacity-50 text-white font-bold px-7 py-3 rounded-xl text-sm transition-all shadow-md shadow-rose-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : editingAddress ? (
                    "Update Delivery Address"
                  ) : (
                    "Save Delivery Address"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


