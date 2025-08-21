import React, { useRef, useState } from "react";
import "./AdmissionForm.css";
import axios from "axios";

export default function AdmissionForm() {
  const BASEURL = import.meta.env.VITE_BASEURL;

  const currentYear = new Date().getFullYear().toString();

  const [personal_info, setPersonal_info] = useState({
    first_name: "",
    last_name: "",
    father_name: "",
    gender: "",
    whatsapp_no: "",
    dob: "",
    age: "",
    CNIC: "",
    alternative_no: "",
    email: "",
    address: "",
    city: "",
    country: "",
    img_URL: "",
    doc_img: "",
    enrolled_year: currentYear,
    Marj_E_Taqleed: "",
    halafnama: false,
    whatsapp_cc: "+92",
    alternative_cc: "+92",
  });

  const [academic_progress, setAcademic_progress] = useState({
    academic_class: "",
    institute_name: "",
    inProgress: false,
    result: null,
  });

  const [previous_madrassa, setPrevious_madrassa] = useState({
    name: "",
    topic: "",
  });

  const [bank_details, setBank_details] = useState({
    bank_name: "",
    account_number: "",
    account_title: "",
    branch: "",
  });

  const [guardian_info, setGuardian_info] = useState({
    name: "",
    relationship: "",
    email: "",
    whatsapp_no: "",
    whatsapp_cc: "+92",
    address: "",
    CNIC: "",
  });

  // Basic errors object for custom validation (optional usage)
  const [errors, setErrors] = useState({});

  // Helper to clear a specific field error when user edits that field again
  const clearError = (field) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  // Helper to format DOB (currently passthrough or converts YYYY-MM-DD to DD/MM/YYYY)
  const formatDobWithSlashes = (d) => {
    if (!d) return "";
    const parts = d.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return d;
  };

  const countryCodes = [
    { code: "+92", label: "PK +92" },
    { code: "+91", label: "IN +91" },
    { code: "+880", label: "BD +880" },
    { code: "+971", label: "AE +971" },
    { code: "+44", label: "UK +44" },
    { code: "+1", label: "US +1" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
  // Personal Info
  if (!personal_info.first_name.trim()) newErrors.first_name = "First name required";
  if (!personal_info.last_name.trim()) newErrors.last_name = "Last name required";
  if (!personal_info.father_name.trim()) newErrors.father_name = "Father name required";
  if (!personal_info.gender) newErrors.gender = "Gender required";
  if (!personal_info.dob) newErrors.dob = "DOB required";
  if (!personal_info.email.trim()) newErrors.email = "Email required";
  if (!personal_info.whatsapp_no.trim()) newErrors.whatsapp_no = "WhatsApp number required";
  if (!personal_info.alternative_no.trim()) newErrors.alternative_no = "Alternative number required";
  if (!personal_info.address.trim()) newErrors.address = "Address required";
  if (!personal_info.city.trim()) newErrors.city = "City required";
  if (!personal_info.country.trim()) newErrors.country = "Country required";
  if (!personal_info.CNIC.trim()) newErrors.CNIC = "CNIC required";
  if (!personal_info.Marj_E_Taqleed) newErrors.Marj_E_Taqleed = "Select Marj-e-Taqleed";
  if (!personal_info.doc_img) newErrors.doc_img = "Document image required";
  if (!personal_info.halafnama) newErrors.halafnama = "Please agree to the Halafnama";
  if (!personal_info.img_URL) newErrors.img_URL = "Profile image required";

  // Guardian Info
  if (!guardian_info.name.trim()) newErrors.guardian_name = "Guardian name required";
  if (!guardian_info.relationship) newErrors.guardian_relationship = "Relationship required";
  if (!guardian_info.email.trim()) newErrors.guardian_email = "Guardian email required";
  if (!guardian_info.whatsapp_no.trim()) newErrors.guardian_whatsapp_no = "Guardian WhatsApp required";
  if (!guardian_info.address.trim()) newErrors.guardian_address = "Guardian address required";
  if (!guardian_info.CNIC.trim()) newErrors.guardian_CNIC = "Guardian CNIC required";

  // Academic
  if (!academic_progress.academic_class) newErrors.academic_class = "Academic class required";
  if (!academic_progress.institute_name.trim()) newErrors.institute_name = "Institute name required";
  if (!academic_progress.inProgress && !academic_progress.result) newErrors.result = "Result required";

  // Previous Madrassa (now mandatory per request)
  if (!previous_madrassa.name.trim()) newErrors.previous_name = "Previous madrassa name required";
  if (!previous_madrassa.topic.trim()) newErrors.previous_topic = "Previous madrassa topic required";

  // Bank Details (now mandatory per request)
  if (!bank_details.bank_name.trim()) newErrors.bank_name = "Bank name required";
  if (!bank_details.account_number.trim()) newErrors.account_number = "Account number required";
  if (!bank_details.account_title.trim()) newErrors.account_title = "Account title required";
  if (!bank_details.branch.trim()) newErrors.branch = "Branch required";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return; // stop submission
    }
    setErrors({});
    // Build payload to match backend schema/body shape
    const marjValue = personal_info.Marj_E_Taqleed?.trim() || "";
    const toDigits = (val) => (val ? String(val).replace(/[^0-9]/g, "") : "");
    const body = {
      personal_info: {
        first_name: personal_info.first_name.trim(),
        last_name: personal_info.last_name.trim(),
        father_name: personal_info.father_name.trim(),
        dob: formatDobWithSlashes(personal_info.dob),
        age: Number(personal_info.age || 0),
        img_URL: personal_info.img_URL,
        whatsapp_no:
          personal_info.whatsapp_cc +
          (personal_info.whatsapp_no
            ? personal_info.whatsapp_no.replace(/[^0-9]/g, "")
            : ""),
        alternative_no:
          personal_info.alternative_cc +
          (personal_info.alternative_no
            ? personal_info.alternative_no.replace(/[^0-9]/g, "")
            : ""),
        email: personal_info.email.trim(),
        address: personal_info.address.trim(),
        city: personal_info.city.trim(),
        country: personal_info.country.trim(),
        enrolled_year: String(personal_info.enrolled_year),
        marj_e_taqleed: marjValue,
        halafnama: Boolean(personal_info.halafnama),
        gender: personal_info.gender,
        CNIC: Number(toDigits(personal_info.CNIC)),
        doc_img: personal_info.doc_img,
      },
      guardian_info: {
        name: guardian_info.name.trim(),
        relationship: guardian_info.relationship.trim().toLowerCase(),
        email: guardian_info.email.trim(),
        whatsapp_no:
          guardian_info.whatsapp_cc +
          (guardian_info.whatsapp_no
            ? guardian_info.whatsapp_no.replace(/[^0-9]/g, "")
            : ""),
        address: guardian_info.address.trim(),
        CNIC: Number(toDigits(guardian_info.CNIC)),
      },
      academic_progress: {
        academic_class: Number(academic_progress.academic_class),
        institute_name: academic_progress.institute_name.trim(),
        inProgress: Boolean(academic_progress.inProgress),
        result: academic_progress.inProgress
          ? undefined
          : academic_progress.result,
      },
      previous_madrassa:
        previous_madrassa.name.trim() || previous_madrassa.topic.trim()
          ? {
              name: previous_madrassa.name.trim(),
              topic: previous_madrassa.topic.trim(),
            }
          : undefined,
      bank_details: Object.values(bank_details).some((v) => v.trim())
        ? {
            bank_name: bank_details.bank_name.trim(),
            account_number: bank_details.account_number.trim(),
            account_title: bank_details.account_title.trim(),
            branch: bank_details.branch.trim(),
          }
        : undefined,
    };
    console.log(body);
    // try {
    //   const api = await axios.post(`${BASEURL}/auth/signup`, body);
    //   console.log(api?.data || api);
    //   alert("Form submitted successfully");
    // } catch (err) {
    //   console.error(err);
    //   alert(err?.response?.data?.message || "Submission failed");
    // }
  };

  const calculateAge = (dobStr) => {
    if (!dobStr) return "";
    const dob = new Date(dobStr);
    if (isNaN(dob.getTime())) return "";
    const now = new Date();
    if (now < dob) return 0.0;
    const diffMs = now.getTime() - dob.getTime();
    const yearMs = 365.2425 * 24 * 60 * 60 * 1000;
    const age = diffMs / yearMs;
    return Number(age.toFixed(2));
  };

  return (
    <div className="admission-form-container">
      <h2>Welcome To Khuddam Learning Online Classes</h2>
      <form className="admission-form-grid" onSubmit={handleSubmit} noValidate>
        {/* Avatar / Profile Photo */}
        <div
          className="avatar-div full-width"
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid #e0e0e0",
                boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fafafa",
                fontSize: 12,
                color: "#666",
                position: "relative",
              }}
            >
              {personal_info.img_URL ? (
                <img
                  src={personal_info.img_URL}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span>Profile Photo</span>
              )}
            </div>
            <label
              style={{
                position: "absolute",
                bottom: 4,
                right: 4,
                background: "#2563eb",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: 20,
                cursor: "pointer",
                fontSize: 12,
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              Change
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const allowed = ["image/jpeg", "image/png", "image/jpg"];
                  if (!allowed.includes(file.type)) {
                    setErrors((prev) => ({
                      ...prev,
                      img_URL: "Only JPG / JPEG / PNG images allowed",
                    }));
                    return;
                  }
                  if (file.size > 2 * 1024 * 1024) {
                    setErrors((prev) => ({
                      ...prev,
                      img_URL: "Max file size 2MB",
                    }));
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => {
                    const dataUrl = String(reader.result || "");
                    setPersonal_info((prev) => ({ ...prev, img_URL: dataUrl }));
                    setErrors((prev) => ({ ...prev, img_URL: undefined }));
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>
          <div style={{ width: "100%", maxWidth: 340 }}>
            <h3 style={{ margin: 0 }}>Upload Profile Photo</h3>
            <p style={{ margin: "4px 0 8px 0", fontSize: 13, color: "#555" }}>
              Clear front face photo. JPG / JPEG / PNG up to 2MB.
            </p>
            {errors.img_URL && (
              <small className="error" style={{ color: "#d00" }}>
                {errors.img_URL}
              </small>
            )}
          </div>
        </div>

        <div id="personal" title="Personal Information" required>
          {/* First Name */}
          <div className="form-group">
            <label>First Name</label>
            <input
              placeholder="Enter First Name"
              value={personal_info.first_name}
              onChange={(e) => {
                const { value } = e.target;
                clearError("first_name");
                setPersonal_info((prev) => ({ ...prev, first_name: value }));
              }}
              type="text"
            />
            {errors.first_name && <small className="error">{errors.first_name}</small>}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label>Last Name</label>
            <input
              placeholder="Enter Last Name"
              value={personal_info.last_name}
              onChange={(e) =>
                (clearError("last_name"),
                setPersonal_info((prev) => ({
                  ...prev,
                  last_name: e.target.value,
                })))
              }
              type="text"
            />
            {errors.last_name && <small className="error">{errors.last_name}</small>}
          </div>

          {/* Father Name */}
          <div className="form-group">
            <label>Father Name</label>
            <input
              placeholder="Enter Father Name"
              value={personal_info.father_name}
              onChange={(e) =>
                (clearError("father_name"),
                setPersonal_info((prev) => ({
                  ...prev,
                  father_name: e.target.value,
                })))
              }
              type="text"
            />
            {errors.father_name && <small className="error">{errors.father_name}</small>}
          </div>

          {/* Profile Image moved to avatar div above */}

          {/* Document Image */}
          <div className="form-group">
            <label>Document Image (ID / Certificate) (Optional)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const dataUrl = String(reader.result || "");
                  setPersonal_info((prev) => ({ ...prev, doc_img: dataUrl }));
                };
                reader.readAsDataURL(file);
              }}
            />
            {errors.doc_img && <small className="error">{errors.doc_img}</small>}
          </div>

          {/* Date Of Birth */}
          <div className="form-group">
            <label>Date Of Birth</label>
            <input
              value={personal_info.dob}
              onChange={(e) => {
                const dob = e.target.value;
                const age = calculateAge(dob);
                clearError("dob");
                setPersonal_info((prev) => ({ ...prev, dob, age }));
              }}
              type="date"
            />
            {errors.dob && <small className="error">{errors.dob}</small>}
          </div>
          {errors.whatsapp_no && <small className="error">{errors.whatsapp_no}</small>}

          {/* Age (auto) */}
          <div className="form-group">
            <label>Age</label>
            <input value={personal_info.age} type="number" readOnly />
          </div>
          {errors.alternative_no && <small className="error">{errors.alternative_no}</small>}

          {/* WhatsApp Number */}
          <div className="form-group">
            <label>WhatsApp Number</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                gap: 8,
              }}
            >
              <select
                value={personal_info.whatsapp_cc}
                onChange={(e) =>
                  setPersonal_info((prev) => ({
                    ...prev,
                    whatsapp_cc: e.target.value,
                  }))
                }
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                placeholder="number without country code"
                value={personal_info.whatsapp_no}
                onChange={(e) =>
                  setPersonal_info((prev) => ({
                    ...prev,
                    whatsapp_no: e.target.value,
                  }))
                }
                type="tel"
              />
            </div>
          </div>
          {errors.address && <small className="error">{errors.address}</small>}

          {/* Alternative Number */}
          <div className="form-group">
            <label>Alternative Number / Parent Number</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                gap: 8,
              }}
            >
              <select
                value={personal_info.alternative_cc}
                onChange={(e) =>
                  setPersonal_info((prev) => ({
                    ...prev,
                    alternative_cc: e.target.value,
                  }))
                }
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                placeholder="number without country code"
                value={personal_info.alternative_no}
                onChange={(e) =>
                  setPersonal_info((prev) => ({
                    ...prev,
                    alternative_no: e.target.value,
                  }))
                }
                type="tel"
              />
            </div>
          </div>
          {errors.city && <small className="error">{errors.city}</small>}

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              placeholder="email@example.com"
              value={personal_info.email}
              onChange={(e) =>
                (clearError("email"),
                setPersonal_info((prev) => ({ ...prev, email: e.target.value })))
              }
              type="email"
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>
          {errors.country && <small className="error">{errors.country}</small>}

          {/* Enrolled Year (auto) */}
          <div className="form-group">
            <label>Enrolled Year</label>
            <input value={personal_info.enrolled_year} readOnly type="text" />
          </div>
          {errors.gender && <small className="error">{errors.gender}</small>}

          {/* Address */}
          <div className="form-group full-width">
            <label>Address</label>
            <textarea
              rows={5}
              placeholder="Street, Area"
              value={personal_info.address}
              onChange={(e) =>
                setPersonal_info((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
          </div>
          {errors.CNIC && <small className="error">{errors.CNIC}</small>}

          {/* City */}
          <div className="form-group">
            <label>City</label>
            <input
              placeholder="Enter City"
              value={personal_info.city}
              onChange={(e) =>
                setPersonal_info((prev) => ({ ...prev, city: e.target.value }))
              }
              type="text"
            />
          </div>
          {errors.Marj_E_Taqleed && <small className="error">{errors.Marj_E_Taqleed}</small>}

          {/* Country */}
          <div className="form-group">
            <label>Country</label>
            <input
              placeholder="Enter Country"
              value={personal_info.country}
              onChange={(e) =>
                setPersonal_info((prev) => ({
                  ...prev,
                  country: e.target.value,
                }))
              }
              type="text"
            />
          </div>
          {errors.guardian_relationship && <small className="error">{errors.guardian_relationship}</small>}

          {/* Gender */}
          <div className="form-group">
            <label>Gender</label>
            <select
              value={personal_info.gender}
              onChange={(e) =>
                setPersonal_info((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }))
              }
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          {errors.guardian_email && <small className="error">{errors.guardian_email}</small>}

          {/* CNIC */}
          <div className="form-group">
            <label>CNIC</label>
            <input
              placeholder="1234512345671"
              value={personal_info.CNIC}
              onChange={(e) =>
                setPersonal_info((prev) => ({ ...prev, CNIC: e.target.value }))
              }
              type="text"
            />
          </div>
          {errors.guardian_whatsapp_no && <small className="error">{errors.guardian_whatsapp_no}</small>}

          {/* Marj-E-Taqleed */}
          <div className="form-group full-width">
            <label>Marj-E-Taqleed</label>
            <select
              value={personal_info.Marj_E_Taqleed}
              onChange={(e) => {
                setPersonal_info((prev) => ({
                  ...prev,
                  Marj_E_Taqleed: e.target.value,
                }));
              }}
            >
              <option value="">Select Marj-e-Taqleed</option>
              <option value="Ayat ullah sistani">Ayat ullah Sistani</option>
              <option value="Ayat ullah khuwi">Ayat ullah Khuwi</option>
              <option value="Ayat ullah khamnai">Ayat ullah Khamnai</option>
            </select>
          </div>
          {errors.guardian_CNIC && <small className="error">{errors.guardian_CNIC}</small>}

          {/* Halafnama Agreement */}
          <div className="form-group checkbox full-width">
            <label className="halafnama-inline">
              <input
                type="checkbox"
                checked={personal_info.halafnama}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) clearError("halafnama");
                  setPersonal_info((prev) => ({ ...prev, halafnama: checked }));
                }}
              />
              <span>I agree to the Halafnama</span>
            </label>
            {errors.halafnama && <small className="error">{errors.halafnama}</small>}
            <div className="agreement-box">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Asperiores nulla magnam exercitationem dolorum laudantium a, ad
              inventore sint officia ullam pariatur incidunt! Labore, iusto! Ex,
              quibusdam. Quia velit ducimus, repellat nulla quisquam labore
              iusto ex saepe quam odit accusantium? Ducimus quas, odit repellat
              et dicta tenetur odio deserunt nisi reprehenderit facere modi? Sit
              reiciendis eaque inventore deleniti exercitationem nisi
              consectetur id iusto expedita aliquam explicabo, magni modi aut
              aperiam corporis tenetur in eos eveniet voluptas quia. Alias
              eveniet doloremque labore officia, quisquam atque quae, nesciunt
              non voluptatum esse magni aliquam natus doloribus facilis
              architecto amet sapiente consectetur, voluptas quis quibusdam.
            </div>
          </div>
          {errors.guardian_address && <small className="error">{errors.guardian_address}</small>}
        </div>
        <div id="guardian" title="Guardian Information" required={false}>
          {/* Guardian Name */}
          <div className="form-group">
            <label>Guardian Name</label>
            <input
              placeholder="Enter Guardian Name"
              value={guardian_info.name}
              onChange={(e) =>
        (clearError("guardian_name"),
        setGuardian_info((prev) => ({ ...prev, name: e.target.value })))
              }
              type="text"
              required
            />
      {errors.guardian_name && <small className="error">{errors.guardian_name}</small>}
          </div>
          {errors.academic_class && <small className="error">{errors.academic_class}</small>}

          {/* Relationship */}
          <div className="form-group">
            <label>Relationship</label>
            <select
              value={guardian_info.relationship}
              onChange={(e) =>
                setGuardian_info((prev) => ({
                  ...prev,
                  relationship: e.target.value,
                }))
              }
              required
            >
              <option value="">Select Relationship</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Guardian">Guardian</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {errors.institute_name && <small className="error">{errors.institute_name}</small>}

          {/* Guardian Email */}
          <div className="form-group">
            <label>Guardian Email</label>
            <input
              placeholder="guardian@example.com"
              value={guardian_info.email}
              onChange={(e) =>
                setGuardian_info((prev) => ({ ...prev, email: e.target.value }))
              }
              type="email"
              required
            />
          </div>
          {errors.result && <small className="error">{errors.result}</small>}

          {/* Guardian WhatsApp */}
          <div className="form-group">
            <label>Guardian WhatsApp</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                gap: 8,
              }}
            >
              <select
                value={guardian_info.whatsapp_cc}
                onChange={(e) =>
                  setGuardian_info((prev) => ({
                    ...prev,
                    whatsapp_cc: e.target.value,
                  }))
                }
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                placeholder="number without country code"
                value={guardian_info.whatsapp_no}
                onChange={(e) =>
                  setGuardian_info((prev) => ({
                    ...prev,
                    whatsapp_no: e.target.value,
                  }))
                }
                type="tel"
                required
              />
            </div>
          </div>
          {errors.previous_name && <small className="error">{errors.previous_name}</small>}

          {/* Guardian CNIC */}
          <div className="form-group">
            <label>Guardian CNIC</label>
            <input
              placeholder="1234512345671"
              value={guardian_info.CNIC}
              onChange={(e) =>
                setGuardian_info((prev) => ({ ...prev, CNIC: e.target.value }))
              }
              type="text"
              required
            />
          </div>
          {errors.previous_topic && <small className="error">{errors.previous_topic}</small>}

          {/* Guardian Address */}
          <div className="form-group full-width">
            <label>Guardian Address</label>
            <textarea
              rows={4}
              placeholder="Street, Area"
              value={guardian_info.address}
              onChange={(e) =>
                setGuardian_info((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              required
            />
          </div>
          {errors.bank_name && <small className="error">{errors.bank_name}</small>}
        </div>

        <div id="academic" title="Academic Information" required={false}>
          <div className="form-group">
            <label>Academic Class</label>
            <input
              placeholder="Enter Class/Grade"
              value={academic_progress.academic_class}
              onChange={(e) =>
                setAcademic_progress((prev) => ({
                  ...prev,
                  academic_class: e.target.value,
                }))
              }
              type="number"
              min={1}
              step={1}
              required
            />
          </div>
          {errors.account_number && <small className="error">{errors.account_number}</small>}
          <div className="form-group">
            <label>Institute Name</label>
            <input
              placeholder="Enter Institute/School"
              value={academic_progress.institute_name}
              onChange={(e) =>
                setAcademic_progress((prev) => ({
                  ...prev,
                  institute_name: e.target.value,
                }))
              }
              type="text"
              required
            />
          </div>
          {errors.account_title && <small className="error">{errors.account_title}</small>}
          <div className="form-group checkbox full-width">
            <label className="halafnama-inline">
              <input
                type="checkbox"
                checked={academic_progress.inProgress}
                onChange={(e) =>
                  setAcademic_progress((prev) => ({
                    ...prev,
                    inProgress: e.target.checked,
                  }))
                }
              />
              Currently in progress
            </label>
          </div>
          {errors.branch && <small className="error">{errors.branch}</small>}
          <div className="form-group">
            <label>Result</label>
            <input
              placeholder={
                academic_progress.inProgress
                  ? "N/A while in progress"
                  : "Enter Result/Grade"
              }
              value={academic_progress.result ?? ""}
              onChange={(e) =>
                setAcademic_progress((prev) => ({
                  ...prev,
                  result: e.target.value,
                }))
              }
              type="text"
              disabled={academic_progress.inProgress}
              required={!academic_progress.inProgress}
            />
          </div>
        </div>

        <div
          id="previous"
          title="Previous Madrassa (Optional)"
          required={false}
        >
          <div className="form-group">
            <label>Previous Madrassa Name</label>
            <input
              placeholder="Enter Madrassa Name"
              value={previous_madrassa.name}
              onChange={(e) =>
                setPrevious_madrassa((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              type="text"
            />
          </div>
          <div className="form-group">
            <label>Previous Madrassa Topic</label>
            <input
              placeholder="Enter Last Studied Topic"
              value={previous_madrassa.topic}
              onChange={(e) =>
                setPrevious_madrassa((prev) => ({
                  ...prev,
                  topic: e.target.value,
                }))
              }
              type="text"
            />
          </div>
        </div>

        <div id="bank" title="Bank Details (Optional)" required={false}>
          <div className="form-group">
            <label>Bank Name</label>
            <input
              placeholder="Enter Bank Name"
              value={bank_details.bank_name}
              onChange={(e) =>
                setBank_details((prev) => ({
                  ...prev,
                  bank_name: e.target.value,
                }))
              }
              type="text"
            />
          </div>
          <div className="form-group">
            <label>Account Number</label>
            <input
              placeholder="Enter Account Number"
              value={bank_details.account_number}
              onChange={(e) =>
                setBank_details((prev) => ({
                  ...prev,
                  account_number: e.target.value,
                }))
              }
              type="text"
            />
          </div>
          <div className="form-group">
            <label>Account Title</label>
            <input
              placeholder="Enter Account Title"
              value={bank_details.account_title}
              onChange={(e) =>
                setBank_details((prev) => ({
                  ...prev,
                  account_title: e.target.value,
                }))
              }
              type="text"
            />
          </div>
          <div className="form-group">
            <label>Branch</label>
            <input
              placeholder="Enter Branch"
              value={bank_details.branch}
              onChange={(e) =>
                setBank_details((prev) => ({ ...prev, branch: e.target.value }))
              }
              type="text"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions full-width">
          <button type="submit">Submit Application</button>
        </div>
      </form>
    </div>
  );
}
