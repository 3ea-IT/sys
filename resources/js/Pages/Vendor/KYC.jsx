import { Head, useForm, Link, router } from "@inertiajs/react";
import { ArrowLeft, Upload } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function VendorKYC({ vendor, kyc }) {
  const { data, setData, post, processing, errors } = useForm({
    business_name: kyc?.business_name || "",
    business_type: kyc?.business_type || "",
    business_description: kyc?.business_description || "",
    phone: kyc?.phone || "",
    address: kyc?.address || "",
    city: kyc?.city || "",
    state: kyc?.state || "",
    postal_code: kyc?.postal_code || "",
    country: kyc?.country || "",
    business_license_number: kyc?.business_license_number || "",
    tax_id: kyc?.tax_id || "",
    account_number: kyc?.account_number || "",
    ifsc_code: kyc?.ifsc_code || "",
    bank_document: null,
  });

  const [fieldErrors, setFieldErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (value) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(value.replace(/\D/g, ''));
  };

  const validatePostalCode = (value) => {
    return value.trim().length > 0;
  };

  const validateTaxId = (value) => {
    return value.trim().length > 0;
  };

  const validateAccountNumber = (value) => {
    return /^\d+$/.test(value) && value.length >= 9 && value.length <= 18;
  };

  const validateIfscCode = (value) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(value);
  };

  // Handle phone input - only numbers, max 10 digits
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setData('phone', value);
    
    // Validate phone
    if (value.length > 0 && value.length !== 10) {
      setFieldErrors(prev => ({ ...prev, phone: 'Phone must be exactly 10 digits' }));
    } else if (value.length === 0) {
      setFieldErrors(prev => ({ ...prev, phone: 'Phone is required' }));
    } else {
      setFieldErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  // Handle other field changes with validation
  const handleFieldChange = (fieldName, value, validator) => {
    setData(fieldName, value);
    
    if (value.trim() === '') {
      setFieldErrors(prev => ({ ...prev, [fieldName]: `${fieldName.replace(/_/g, ' ')} is required` }));
    } else if (validator && !validator(value)) {
      const errorMessages = {
        postal_code: 'Please enter a valid postal code',
        tax_id: 'Please enter a valid tax ID',
        // account_number: 'Account number must be 9-18 digits',
        // ifsc_code: 'IFSC code format: AAAA0XXXXXX (e.g., SBIN0001234)',
      };
      setFieldErrors(prev => ({ ...prev, [fieldName]: errorMessages[fieldName] }));
    } else {
      setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  // Check if all fields are valid
  const isFormValid = useMemo(() => {
    const allFieldsFilled = 
      data.business_name.trim() !== '' &&
      data.business_type !== '' &&
      data.business_description.trim() !== '' &&
      data.phone.trim() !== '' &&
      data.address.trim() !== '' &&
      data.city.trim() !== '' &&
      data.state.trim() !== '' &&
      data.postal_code.trim() !== '' &&
      data.country.trim() !== '' &&
      data.business_license_number.trim() !== '' &&
      data.tax_id.trim() !== '' &&
      data.account_number.trim() !== '' &&
      data.ifsc_code.trim() !== '' &&
      (data.bank_document !== null || kyc?.bank_document_path);

    const allFieldsValid =
      data.phone.length === 10 &&
      validatePostalCode(data.postal_code) &&
      validateTaxId(data.tax_id) &&
      validateAccountNumber(data.account_number) &&
      validateIfscCode(data.ifsc_code);

    const noErrors = Object.values(fieldErrors).every(error => error === '');

    return allFieldsFilled && allFieldsValid && noErrors;
  }, [data, fieldErrors, kyc?.bank_document_path]);

  const submit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      post(route("vendor.kyc.update"), {
        forceFormData: true,
      });
    }
  };

  const handleBackClick = () => {
    // If vendor with incomplete KYC, logout and redirect to login
    if (vendor?.role === 'vendor' && kyc?.status === 'incomplete') {
      router.post(route('logout'), {}, {
        onSuccess: () => {
          router.visit(route('login'));
        }
      });
    } else {
      // Otherwise just redirect to login
      router.visit(route('login'));
    }
  };

  return (
    <>
      <Head title="Complete Your KYC" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={handleBackClick}
                className="flex items-center gap-2 text-brand-primary hover:opacity-80 transition-opacity mb-4 bg-transparent border-0 cursor-pointer"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-semibold">Back to Login</span>
              </button>

              <h1 className="text-3xl font-black mb-2" style={{ color: "#0F2A44" }}>
                Complete Your Profile
              </h1>
              <p className="text-brand-secondary text-sm">
                Help us know more about your business. Fill in the details below.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="bg-white rounded-lg shadow-sm border border-brand-border p-6 sm:p-8 space-y-6">

              {/* Section 1: Basic Business Information */}
              <div className="border-b border-brand-border pb-6 last:border-b-0">
                <h2 className="text-lg font-bold text-brand-primary mb-4">Business Information</h2>

                {/* Business Name */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-brand-primary mb-2">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.business_name}
                    onChange={(e) => handleFieldChange("business_name", e.target.value, null)}
                    disabled={kyc?.business_name ? true : false}
                    className={`w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ${kyc?.business_name ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''}`}
                    placeholder="e.g., Premium Event Venue"
                  />
                  {kyc?.business_name && (
                    <p className="text-xs text-green-600 mt-1">✓ Set during registration</p>
                  )}
                  {(fieldErrors.business_name || errors.business_name) && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.business_name || errors.business_name}</p>
                  )}
                </div>

                {/* Business Type */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-brand-primary mb-2">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={data.business_type}
                    onChange={(e) => handleFieldChange("business_type", e.target.value, null)}
                    disabled={kyc?.business_type ? true : false}
                    className={`w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ${kyc?.business_type ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''}`}
                  >
                    <option value="">Select business type</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Knowledge">Knowledge</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Travel">Travel</option>
                    <option value="Dining">Dining</option>
                  </select>
                  {kyc?.business_type && (
                    <p className="text-xs text-green-600 mt-1">✓ Set during registration</p>
                  )}
                  {(fieldErrors.business_type || errors.business_type) && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.business_type || errors.business_type}</p>
                  )}
                </div>

                {/* Business Description */}
                <div>
                  <label className="block text-sm font-semibold text-brand-primary mb-2">
                    Business Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={data.business_description}
                    onChange={(e) => handleFieldChange("business_description", e.target.value, null)}
                    rows="4"
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all resize-none"
                    placeholder="Tell us about your business, what makes it unique..."
                  />
                  {(fieldErrors.business_description || errors.business_description) && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.business_description || errors.business_description}</p>
                  )}
                </div>
              </div>

              {/* Section 2: Contact Information */}
              <div className="border-b border-brand-border pb-6 last:border-b-0">
                <h2 className="text-lg font-bold text-brand-primary mb-4">Contact Information</h2>

                {/* Phone */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-brand-primary mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    placeholder="Enter 10 digit phone number"
                    maxLength="10"
                  />
                  {(fieldErrors.phone || errors.phone) && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.phone || errors.phone}</p>
                  )}
                  {data.phone.length === 10 && !fieldErrors.phone && (
                    <p className="text-green-600 text-xs mt-1">✓ Valid phone number</p>
                  )}
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-brand-primary mb-2">
                    Business Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.address}
                    onChange={(e) => handleFieldChange("address", e.target.value, null)}
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    placeholder="123 Main Street"
                  />
                  {(fieldErrors.address || errors.address) && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.address || errors.address}</p>
                  )}
                </div>

                {/* City, State, Postal Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-primary mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={data.city}
                      onChange={(e) => handleFieldChange("city", e.target.value, null)}
                      className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                      placeholder="City"
                    />
                    {(fieldErrors.city || errors.city) && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.city || errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-primary mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={data.state}
                      onChange={(e) => handleFieldChange("state", e.target.value, null)}
                      className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                      placeholder="State"
                    />
                    {(fieldErrors.state || errors.state) && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.state || errors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-primary mb-2">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={data.postal_code}
                      onChange={(e) => handleFieldChange("postal_code", e.target.value, validatePostalCode)}
                      className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                      placeholder="ZIP/Postal Code"
                    />
                    {(fieldErrors.postal_code || errors.postal_code) && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.postal_code || errors.postal_code}</p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-brand-primary mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.country}
                    onChange={(e) => handleFieldChange("country", e.target.value, null)}
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    placeholder="Country"
                  />
                  {(fieldErrors.country || errors.country) && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.country || errors.country}</p>
                  )}
                </div>
              </div>

              {/* Section 3: Legal & Financial Information */}
              <div className="pb-6">
                <h2 className="text-lg font-bold text-brand-primary mb-4">Legal & Financial Information</h2>

                {/* Business License Number */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-brand-primary mb-2">
                    Business License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.business_license_number}
                    onChange={(e) => handleFieldChange("business_license_number", e.target.value, null)}
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    placeholder="Your business license number"
                  />
                  {(fieldErrors.business_license_number || errors.business_license_number) && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.business_license_number || errors.business_license_number}</p>
                  )}
                </div>

                {/* Tax ID */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-brand-primary mb-2">
                    Tax ID / GST Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.tax_id}
                    onChange={(e) => handleFieldChange("tax_id", e.target.value, validateTaxId)}
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    placeholder="Your tax ID or GST number"
                  />
                  {(fieldErrors.tax_id || errors.tax_id) && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.tax_id || errors.tax_id}</p>
                  )}
                </div>

                {/* Bank Details */}
                <h3 className="text-md font-semibold text-brand-primary mb-4 mt-6">Bank Account Information</h3>

                {/* Account Number */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-brand-primary mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.account_number}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      handleFieldChange("account_number", value, validateAccountNumber);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    placeholder="Your bank account number"
                    maxLength="18"
                  />
                  {(fieldErrors.account_number || errors.account_number) && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.account_number || errors.account_number}</p>
                  )}
                  {data.account_number && data.account_number.length < 9 && (
                    <p className="text-orange-500 text-xs mt-1">Account number should be at least 9 digits</p>
                  )}
                </div>

                {/* IFSC Code */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-brand-primary mb-2">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.ifsc_code}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      handleFieldChange("ifsc_code", value, validateIfscCode);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    placeholder="e.g., SBIN0001234"
                    maxLength="11"
                  />
                  {(fieldErrors.ifsc_code || errors.ifsc_code) && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.ifsc_code || errors.ifsc_code}</p>
                  )}
                </div>

                {/* Bank Document Upload */}
                <div>
                  <label className="block text-sm font-semibold text-brand-primary mb-2">
                    Bank Passbook / Cancelled Cheque <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="bank_document"
                      onChange={(e) => {
                        setData("bank_document", e.target.files?.[0] || null);
                        if (e.target.files?.[0]) {
                          setFieldErrors(prev => ({ ...prev, bank_document: '' }));
                        }
                      }}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                    />
                    <label
                      htmlFor="bank_document"
                      className="flex flex-col items-center justify-center px-4 py-8 border-2 border-dashed border-brand-border rounded-lg cursor-pointer hover:border-brand-primary hover:bg-blue-50 transition-all"
                    >
                      <Upload size={24} className="text-brand-secondary mb-2" />
                      <span className="text-sm font-semibold text-brand-primary">
                        {data.bank_document ? data.bank_document.name : "Click to upload"}
                      </span>
                      <span className="text-xs text-brand-secondary mt-1">
                        PDF, JPG, or PNG (Max 5MB)
                      </span>
                    </label>
                  </div>
                  {kyc?.bank_document_path && !data.bank_document && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Document already uploaded
                    </p>
                  )}
                  {errors.bank_document && (
                    <p className="text-red-500 text-xs mt-1">{errors.bank_document}</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 pt-4 border-t border-brand-border">
                <button
                  type="submit"
                  disabled={!isFormValid || processing}
                  className="flex-1 py-3 rounded-lg text-sm font-bold text-white uppercase tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "#0F2A44" }}
                >
                  {processing ? "Saving..." : "Submit for Approval"}
                </button>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-brand-primary leading-relaxed">
                  <strong>Note:</strong> Your vendor account is currently <span className="font-semibold">pending admin approval</span>. Once approved, you'll be able to list experiences and accept bookings. You can update this information anytime from your profile settings.
                </p>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
