"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { 
  Plus, 
  Edit, 
  X, 
  Search, 
  Check, 
  AlertCircle, 
  Loader2, 
  Sliders, 
  Tag,
  RotateCcw
} from "lucide-react";
import { 
  createAttribute, 
  updateAttribute, 
  Attribute 
} from "@/lib/api/attributes";

interface AttributesClientProps {
  initialAttributes: Attribute[];
}

export default function AttributesClient({ initialAttributes }: AttributesClientProps) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  // Data State
  const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  
  // Fields State
  const [name, setName] = useState("");
  const [type, setType] = useState<"text" | "rich_text" | "select" | "multi_select">("text");
  const [values, setValues] = useState<string[]>([]);
  const [valueInput, setValueInput] = useState("");
  const [status, setStatus] = useState("active");
  const [isDefaultSpecification, setIsDefaultSpecification] = useState(false);

  // Sync props to state when server updates
  useEffect(() => {
    setAttributes(initialAttributes);
  }, [initialAttributes]);

  // Utility to show notification auto-fading after 4s
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Reset form to Create mode
  const handleResetForm = () => {
    setEditingAttribute(null);
    setName("");
    setType("text");
    setValues([]);
    setValueInput("");
    setStatus("active");
    setIsDefaultSpecification(false);
  };

  // Open Form for Edit
  const handleOpenEdit = (attribute: Attribute) => {
    setEditingAttribute(attribute);
    setName(attribute.name);
    setType(attribute.type);
    setValues(attribute.values || []);
    setValueInput("");
    setStatus(attribute.is_active ? "active" : "inactive");
    setIsDefaultSpecification(!!attribute.is_default_specification);
    
    // Scroll smoothly to form on mobile/small screens
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Form Submit Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification("error", "Attribute name is required.");
      return;
    }

    if (type !== "text" && type !== "rich_text" && values.length === 0) {
      showNotification("error", "Predefined options attributes must have at least one option value.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      type,
      values: type !== "text" && type !== "rich_text" ? values : null,
      is_active: status === "active",
      is_default_specification: isDefaultSpecification,
    };

    let response;
    if (editingAttribute) {
      response = await updateAttribute(editingAttribute.id, payload);
    } else {
      response = await createAttribute(payload);
    }

    setIsSubmitting(false);

    if (response.success) {
      showNotification("success", response.message);
      handleResetForm();
      router.refresh();
    } else {
      showNotification("error", response.message);
    }
  };

  // Status Toggle Action
  const handleToggleStatus = async (attribute: Attribute) => {
    const originalStatus = attribute.is_active;
    
    // Optimistic Update UI
    setAttributes(prev => 
      prev.map(attr => 
        attr.id === attribute.id ? { ...attr, is_active: !originalStatus } : attr
      )
    );

    const response = await updateAttribute(attribute.id, {
      name: attribute.name,
      type: attribute.type,
      values: attribute.values || null,
      is_active: !originalStatus,
      is_default_specification: attribute.is_default_specification,
    });

    if (response.success) {
      showNotification("success", `Attribute "${attribute.name}" status updated successfully.`);
      router.refresh();
    } else {
      showNotification("error", response.message);
      // Revert status on failure
      setAttributes(prev => 
        prev.map(attr => 
          attr.id === attribute.id ? { ...attr, is_active: originalStatus } : attr
        )
      );
    }
  };

  // Filter attributes by search query
  const filteredAttributes = attributes.filter(attr => 
    attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attr.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-2 pl-2 pr-4 pb-4 md:pt-3 md:pl-3 md:pr-6 md:pb-6 lg:pt-4 lg:pl-4 lg:pr-8 lg:pb-8 w-full space-y-6 relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-xl backdrop-blur-md animate-in slide-in-from-top-4 duration-300 
          ${notification.type === 'success' 
            ? 'bg-emerald-50/90 border-emerald-100 text-emerald-800' 
            : 'bg-rose-50/90 border-rose-100 text-rose-800'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
            {notification.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          </div>
          <div>
            <p className="text-sm font-semibold">{notification.type === 'success' ? 'Success' : 'Error'}</p>
            <p className="text-xs text-slate-500 mt-0.5">{notification.message}</p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 transition-colors ml-4"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Grid Layout: Left List Table + Right On-Page Form Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Attributes List Table */}
        <div className="lg:col-span-7">
          <Card className="overflow-hidden border border-slate-200/80 shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 px-6 bg-slate-50/30 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-800">Attributes List</CardTitle>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <Input 
                    type="text" 
                    placeholder="Search attributes..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-8 w-full rounded-xl bg-white border-slate-200 text-xs"
                  />
                </div>
                <Button 
                  onClick={handleResetForm} 
                  className="h-8 rounded-xl shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold"
                >
                  <Plus size={16} className="mr-1" />
                  Add Attribute
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3.5 font-bold uppercase tracking-wider w-12">ID</th>
                      <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Attribute Name</th>
                      <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Type</th>
                      <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Values</th>
                      <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-right w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAttributes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-slate-400">No attributes found</td>
                      </tr>
                    ) : (
                      filteredAttributes.map((row) => (
                        <tr 
                          key={row.id} 
                          className={`transition-colors group ${
                            editingAttribute?.id === row.id ? "bg-indigo-50/40" : "hover:bg-slate-50/50"
                          }`}
                        >
                          <td className="px-5 py-3.5 text-slate-500 font-medium">#{row.id}</td>
                          <td className="px-5 py-3.5 font-bold text-slate-800">
                            <div className="flex items-center gap-2">
                              <span>{row.name}</span>
                              {row.is_default_specification && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                  Default Spec
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border
                              ${row.type === 'multi_select'
                                ? 'bg-pink-50 border-pink-100 text-pink-700'
                                : row.type === 'select' 
                                ? 'bg-purple-50 border-purple-100 text-purple-700' 
                                : row.type === 'rich_text'
                                ? 'bg-amber-50 border-amber-100 text-amber-700'
                                : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                              {row.type === 'multi_select' ? 'Multi-select' : row.type === 'select' ? 'Predefined' : row.type === 'rich_text' ? 'Rich Text' : 'Custom Text'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 max-w-xs truncate">
                            {row.type !== 'text' && row.type !== 'rich_text' && row.values && row.values.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {row.values.map((val, vIdx) => (
                                  <span key={vIdx} className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-medium">
                                    {val}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Custom Input</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(row)}
                              title="Click to toggle status"
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all hover:scale-105 active:scale-95
                                ${row.is_active 
                                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100/60' 
                                  : 'bg-rose-50 border-rose-100 text-rose-700 hover:bg-rose-100/60'}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${row.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              {row.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => handleOpenEdit(row)}
                              className={`h-7.5 w-7.5 rounded-lg border-none transition-all p-0 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 shadow-xs ${
                                editingAttribute?.id === row.id
                                  ? "bg-indigo-600 text-white"
                                  : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                              }`}
                              title="Edit Attribute"
                            >
                              <Edit size={13} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Add / Edit Attribute Form Card */}
        <div ref={formRef} className="lg:col-span-5 space-y-4 sticky top-4">
          <Card className="overflow-hidden shadow-sm border border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                  <Sliders size={16} />
                </div>
                <CardTitle className="text-base font-bold text-slate-800">
                  {editingAttribute ? "Edit Attribute" : "Add Attribute"}
                </CardTitle>
              </div>

              {editingAttribute && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center gap-1"
                  title="Cancel edit and switch to create"
                >
                  <RotateCcw size={12} />
                  New Attribute
                </button>
              )}
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Attribute Name */}
                <div className="space-y-2">
                  <Label htmlFor="attribute-name" className="text-xs font-bold text-slate-500 uppercase">
                    Attribute Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input 
                    id="attribute-name"
                    type="text" 
                    placeholder="e.g. Color, Size, Key Ingredients" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="rounded-xl h-9 border-slate-200 text-sm"
                  />
                </div>

                {/* Attribute Type */}
                <div className="space-y-2">
                  <Label htmlFor="attribute-type" className="text-xs font-bold text-slate-500 uppercase">Type</Label>
                  <div className="relative">
                    <Select 
                      id="attribute-type"
                      value={type}
                      onChange={(e) => setType(e.target.value as "text" | "rich_text" | "select" | "multi_select")}
                      className="rounded-xl h-9 border-slate-200 text-slate-700 bg-white text-xs"
                    >
                      <option value="text">Custom text (User types text)</option>
                      <option value="rich_text">Rich Text (User inputs formatted rich content)</option>
                      <option value="select">Predefined list (Single option)</option>
                      <option value="multi_select">Multi-select list (Multiple options)</option>
                    </Select>
                  </div>
                </div>

                {/* Predefined Values Tag Input Section */}
                {type !== "text" && type !== "rich_text" && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="predefined-values" className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                      <Tag size={12} className="text-slate-400" /> Predefined Options <span className="text-rose-500">*</span>
                    </Label>
                    <div className="flex flex-wrap items-center gap-1.5 p-2 border border-slate-200 rounded-xl bg-white min-h-[44px] focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                      {values.map((val, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 select-none">
                          {val}
                          <button
                            type="button"
                            onClick={() => {
                              setValues(values.filter((_, i) => i !== index));
                            }}
                            className="w-3.5 h-3.5 rounded-full bg-indigo-100/50 hover:bg-indigo-100 flex items-center justify-center text-indigo-700 hover:text-indigo-900 transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                      <input
                        id="predefined-values"
                        type="text"
                        placeholder={values.length === 0 ? "Type & press Enter or Comma" : "Add..."}
                        value={valueInput}
                        onChange={(e) => setValueInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            const val = valueInput.trim().replace(/,/g, "");
                            if (val && !values.includes(val)) {
                              setValues([...values, val]);
                            }
                            setValueInput("");
                          } else if (e.key === "Backspace" && !valueInput && values.length > 0) {
                            setValues(values.slice(0, -1));
                          }
                        }}
                        className="flex-1 min-w-[120px] bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none border-none p-1"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">Press Enter or comma to add option values.</p>
                  </div>
                )}

                {/* Status Selection */}
                <div className="space-y-2">
                  <Label htmlFor="attribute-status" className="text-xs font-bold text-slate-500 uppercase">Status</Label>
                  <div className="relative">
                    <Select 
                      id="attribute-status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="rounded-xl h-9 border-slate-200 text-slate-700 bg-white text-xs"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Select>
                  </div>
                </div>

                {/* Default Specification Option */}
                <div className="flex items-start space-x-3 p-3 rounded-xl border border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50/60 transition-colors">
                  <input
                    id="is-default-specification"
                    type="checkbox"
                    checked={isDefaultSpecification}
                    onChange={(e) => setIsDefaultSpecification(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer mt-0.5"
                  />
                  <Label htmlFor="is-default-specification" className="text-xs font-bold text-slate-800 cursor-pointer select-none">
                    Default Specification
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      Auto-open field in Add Product form
                    </span>
                  </Label>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  {editingAttribute && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={handleResetForm}
                      disabled={isSubmitting}
                      className="flex-1 h-9 rounded-xl border border-slate-200 text-xs font-semibold"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/10"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin mr-1.5" />
                        Saving...
                      </>
                    ) : editingAttribute ? 'Update Attribute' : 'Save Attribute'}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
