import React, { useRef, useState } from "react";
import "./AdmissionForm.css";
import axios from "axios";

export default function AdmissionForm() {
  const currentYear = new Date().getFullYear().toString();
  const [personal_info, setPersonal_info] = useState({
    first_name: "",
    last_name: "",
    father_name: "",
    dob: "",
    age: "",
    img_URL: "",
    whatsapp_no: "",
    alternative_no: "",
    email: "",
    address: "",
    city: "",
    country: "",
  gender: "",
  CNIC: "",
  whatsapp_cc: "+92",
  alternative_cc: "+92",
    enrolled_year: currentYear,
    Marj_E_Taqleed: "",
    halafnama: false,
  });

  const [academic_progress, setAcademic_progress] = useState({
    academic_class: "",
    institute_name: "",
    inProgress: false,
    result: null,
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

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [marjSelection, setMarjSelection] = useState("");
  const halafnamaRef = useRef(null);

  const BASEURL = import.meta.env.VITE_BASEURL; 
  const countryCodes = [
    { code: "+92", label: "PK +92" },
    { code: "+91", label: "IN +91" },
    { code: "+880", label: "BD +880" },
    { code: "+971", label: "AE +971" },
    { code: "+44", label: "UK +44" },
    { code: "+1", label: "US +1" },
  ];

  const calculateAge = (dateStr) => {
    if (!dateStr) return "";
    const dobDate = new Date(dateStr);
    if (Number.isNaN(dobDate.getTime())) return "";
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return String(age);
  };

  const formatDobWithSlashes = (iso) => {
    // iso expected as yyyy-mm-dd from input[type=date]
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    if (!y || !m || !d) return iso;
    // Remove leading zeros from month/day to match 2004/12/9 style
    const mm = String(Number(m));
    const dd = String(Number(d));
    return `${y}/${mm}/${dd}`;
  };

  const validate = () => {
    const newErrors = {};
    // Personal info required
    if (!personal_info.first_name?.trim()) newErrors.first_name = "First name is required";
    if (!personal_info.last_name?.trim()) newErrors.last_name = "Last name is required";
    if (!personal_info.father_name?.trim()) newErrors.father_name = "Father name is required";
    if (!personal_info.img_URL?.trim()) newErrors.img_URL = "Profile photo is required";
    if (!personal_info.dob) newErrors.dob = "Date of birth is required";
    if (!personal_info.whatsapp_no?.trim()) newErrors.whatsapp_no = "WhatsApp number is required";
    if (!personal_info.alternative_no?.trim()) newErrors.alternative_no = "Alternative number is required";
    if (!personal_info.email?.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal_info.email)) newErrors.email = "Invalid email";
    if (!personal_info.address?.trim()) newErrors.address = "Address is required";
    if (!personal_info.city?.trim()) newErrors.city = "City is required";
    if (!personal_info.country?.trim()) newErrors.country = "Country is required";
    if (!personal_info.gender?.trim()) newErrors.gender = "Gender is required";
    if (!personal_info.CNIC?.trim()) newErrors.CNIC = "CNIC is required";
    else {
      const digits = personal_info.CNIC.replace(/[^0-9]/g, "");
      if (digits.length !== 13) newErrors.CNIC = "Invalid CNIC (13 digits)";
    }
    // Marj-e-Taqleed selection required; if Others, text required
    if (!marjSelection) newErrors.Marj_E_Taqleed = "Please select Marj-e-Taqleed";
    if (marjSelection === "Others" && !personal_info.Marj_E_Taqleed?.trim()) {
      newErrors.Marj_E_Taqleed = "Please enter Marj-e-Taqleed";
    }
    // Academic info required
    if (!academic_progress.academic_class?.trim()) newErrors.academic_class = "Academic class is required";
    if (!academic_progress.institute_name?.trim()) newErrors.institute_name = "Institute name is required";
    if (!academic_progress.inProgress && !academic_progress.result?.trim()) newErrors.result = "Result is required";

    // Guardian info required
    if (!guardian_info.name?.trim()) newErrors.guardian_name = "Guardian name is required";
    if (!guardian_info.relationship?.trim()) newErrors.guardian_relationship = "Relationship is required";
    if (!guardian_info.email?.trim()) newErrors.guardian_email = "Guardian email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guardian_info.email)) newErrors.guardian_email = "Invalid email";
    if (!guardian_info.whatsapp_no?.trim()) newErrors.guardian_whatsapp_no = "WhatsApp number is required";
    if (!guardian_info.address?.trim()) newErrors.guardian_address = "Address is required";
    if (!guardian_info.CNIC?.trim()) newErrors.guardian_CNIC = "CNIC is required";
    else {
      const gDigits = guardian_info.CNIC.replace(/[^0-9]/g, "");
      if (gDigits.length !== 13) newErrors.guardian_CNIC = "Invalid CNIC (13 digits)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!personal_info.halafnama) {
      setErrors((prev) => ({ ...prev, halafnama: "Please agree to the Halafnama" }));
      try {
        halafnamaRef.current?.focus();
        halafnamaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch {}
      return;
    }
    if (!validate()) return;
    // Build payload to match backend schema/body shape
    const marjValue = (personal_info.Marj_E_Taqleed?.trim()?.length
      ? personal_info.Marj_E_Taqleed.trim()
      : marjSelection) || "";
    const toDigits = (val) => (val ? String(val).replace(/[^0-9]/g, "") : "");
  const body = {
      personal_info: {
        first_name: personal_info.first_name.trim(),
        last_name: personal_info.last_name.trim(),
        father_name: personal_info.father_name.trim(),
    dob: formatDobWithSlashes(personal_info.dob),
        age: Number(personal_info.age || 0),
        img_URL: personal_info.img_URL,
  whatsapp_no: personal_info.whatsapp_cc + (personal_info.whatsapp_no ? personal_info.whatsapp_no.replace(/[^0-9]/g, "") : ""),
  alternative_no: personal_info.alternative_cc + (personal_info.alternative_no ? personal_info.alternative_no.replace(/[^0-9]/g, "") : ""),
        email: personal_info.email.trim(),
        address: personal_info.address.trim(),
        city: personal_info.city.trim(),
        country: personal_info.country.trim(),
        enrolled_year: String(personal_info.enrolled_year),
        marj_e_taqleed: marjValue,
        halafnama: Boolean(personal_info.halafnama),
        gender: personal_info.gender,
        CNIC: Number(toDigits(personal_info.CNIC)),
      },
      guardian_info: {
        name: guardian_info.name.trim(),
        relationship: guardian_info.relationship.trim().toLowerCase(),
        email: guardian_info.email.trim(),
        whatsapp_no: guardian_info.whatsapp_cc + (guardian_info.whatsapp_no ? guardian_info.whatsapp_no.replace(/[^0-9]/g, "") : ""),
        address: guardian_info.address.trim(),
        CNIC: Number(toDigits(guardian_info.CNIC)),
      },
      academic_progress: {
        academic_class: Number(academic_progress.academic_class),
        institute_name: academic_progress.institute_name.trim(),
        inProgress: Boolean(academic_progress.inProgress),
        result: academic_progress.inProgress ? undefined : academic_progress.result,
      },
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

  return (
    <div className="admission-form-container">
      <h2>Welcome To Khuddam Learning Online Classes</h2>
      <form className="admission-form-grid" onSubmit={handleSubmit}>
        <h3 className="section-title">Personal Information</h3>
        {/* First Name */}
        <div className="form-group">
          <label>First Name</label>
          <input
            name="first_name"
            placeholder="Enter First Name"
            value={personal_info.first_name}
            onChange={(e) => {
              setPersonal_info({ ...personal_info, first_name: e.target.value });
            }}
            type="text"
            required
          />
          {errors.first_name && <small className="error">{errors.first_name}</small>}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label>Last Name</label>
          <input
            name="last_name"
            placeholder="Enter Last Name"
            value={personal_info.last_name}
            onChange={(e) => {
              setPersonal_info({ ...personal_info, last_name: e.target.value });
            }}
            type="text"
            required
          />
          {errors.last_name && <small className="error">{errors.last_name}</small>}
        </div>

        {/* Father Name */}
        <div className="form-group">
          <label>Father Name</label>
          <input
            name="father_name"
            placeholder="Enter Father Name"
            value={personal_info.father_name}
            onChange={(e) => {
              setPersonal_info({ ...personal_info, father_name: e.target.value });
            }}
            type="text"
            required
          />
          {errors.father_name && <small className="error">{errors.father_name}</small>}
        </div>

        {/* Profile Image */}
        <div className="form-group">
          <label>Profile Photo</label>
          <input
            name="img_URL"
            type="file"
            accept="image/*"
            required={!personal_info.img_URL}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = String(reader.result || "");
                setPersonal_info({ ...personal_info, img_URL: dataUrl });
                setImagePreview(dataUrl);
              };
              reader.readAsDataURL(file);
            }}
          />
          {errors.img_URL && <small className="error">{errors.img_URL}</small>}
          {imagePreview || personal_info.img_URL ? (
            <img
              src={imagePreview || personal_info.img_URL}
              alt="preview"
              className="image-preview"
            />
          ) : null}
        </div>

        {/* Date Of Birth */}
        <div className="form-group">
          <label>Date Of Birth</label>
          <input
            name="dob"
            value={personal_info.dob}
            onChange={(e) => {
              const dob = e.target.value;
              const age = calculateAge(dob);
              setPersonal_info({ ...personal_info, dob, age });
            }}
            type="date"
            required
          />
          {errors.dob && <small className="error">{errors.dob}</small>}
        </div>

        {/* Age (auto) */}
        <div className="form-group">
          <label>Age</label>
          <input name="age" value={personal_info.age} type="number" readOnly />
        </div>

        {/* WhatsApp Number */}
        <div className="form-group">
          <label>WhatsApp Number</label>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 8 }}>
            <select
              name="whatsapp_cc"
              value={personal_info.whatsapp_cc}
              onChange={(e) => setPersonal_info({ ...personal_info, whatsapp_cc: e.target.value })}
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <input
              name="whatsapp_no"
              placeholder="number without country code"
              value={personal_info.whatsapp_no}
              onChange={(e) => setPersonal_info({ ...personal_info, whatsapp_no: e.target.value })}
              type="tel"
              required
            />
          </div>
          {errors.whatsapp_no && <small className="error">{errors.whatsapp_no}</small>}
        </div>

        {/* Alternative Number */}
        <div className="form-group">
          <label>Alternative Number / Parent Number</label>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 8 }}>
            <select
              name="alternative_cc"
              value={personal_info.alternative_cc}
              onChange={(e) => setPersonal_info({ ...personal_info, alternative_cc: e.target.value })}
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <input
              name="alternative_no"
              placeholder="number without country code"
              value={personal_info.alternative_no}
              onChange={(e) => setPersonal_info({ ...personal_info, alternative_no: e.target.value })}
              type="tel"
              required
            />
          </div>
          {errors.alternative_no && <small className="error">{errors.alternative_no}</small>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            placeholder="email@example.com"
            value={personal_info.email}
            onChange={(e) => setPersonal_info({ ...personal_info, email: e.target.value })}
            type="email"
            required
          />
          {errors.email && <small className="error">{errors.email}</small>}
        </div>

        {/* Enrolled Year (auto) */}
        <div className="form-group">
          <label>Enrolled Year</label>
          <input
            name="enrolled_year"
            value={personal_info.enrolled_year}
            readOnly
            type="text"
          />
        </div>

        {/* Address */}
        <div className="form-group full-width">
          <label>Address</label>
          <textarea
            name="address"
            rows={5}
            placeholder="Street, Area"
            value={personal_info.address}
            onChange={(e) => setPersonal_info({ ...personal_info, address: e.target.value })}
            required
          />
          {errors.address && <small className="error">{errors.address}</small>}
        </div>

        {/* City */}
        <div className="form-group">
          <label>City</label>
          <input
            name="city"
            placeholder="Enter City"
            value={personal_info.city}
            onChange={(e) => setPersonal_info({ ...personal_info, city: e.target.value })}
            type="text"
            required
          />
          {errors.city && <small className="error">{errors.city}</small>}
        </div>

        {/* Country */}
        <div className="form-group">
          <label>Country</label>
          <input
            name="country"
            placeholder="Enter Country"
            value={personal_info.country}
            onChange={(e) => setPersonal_info({ ...personal_info, country: e.target.value })}
            type="text"
            required
          />
          {errors.country && <small className="error">{errors.country}</small>}
        </div>

        {/* Gender */}
        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={personal_info.gender}
            onChange={(e) => setPersonal_info({ ...personal_info, gender: e.target.value })}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && <small className="error">{errors.gender}</small>}
        </div>

        {/* CNIC */}
        <div className="form-group">
          <label>CNIC</label>
          <input
            name="CNIC"
            placeholder="1234512345671"
            value={personal_info.CNIC}
            onChange={(e) => setPersonal_info({ ...personal_info, CNIC: e.target.value })}
            type="text"
            required
          />
          {errors.CNIC && <small className="error">{errors.CNIC}</small>}
        </div>

        {/* Marj-E-Taqleed */}
        <div className="form-group full-width">
          <label>Marj-E-Taqleed</label>
          <select
            name="Marj_E_Taqleed_select"
            value={marjSelection}
            onChange={(e) => {
              const val = e.target.value;
              setMarjSelection(val);
              if (val !== "Others") {
                setPersonal_info({ ...personal_info, Marj_E_Taqleed: val });
              } else {
                // keep current typed value if any
                setPersonal_info({ ...personal_info, Marj_E_Taqleed: personal_info.Marj_E_Taqleed || "" });
              }
            }}
            required
          >
            <option value="">Select Marj-e-Taqleed</option>
            <option value="Ayat ullah sistani">Ayat ullah Sistani</option>
            <option value="Ayat ullah khuwi">Ayat ullah Khuwi</option>
            <option value="Ayat ullah khamnai">Ayat ullah Khamnai</option>
            <option value="Others">Others</option>
          </select>
      {errors.Marj_E_Taqleed && <small className="error">{errors.Marj_E_Taqleed}</small>}
      {marjSelection === "Others" && (
            <input
              style={{ marginTop: 8 }}
              name="Marj_E_Taqleed"
              placeholder="Enter Marj-e-Taqleed"
              value={personal_info.Marj_E_Taqleed}
              onChange={(e) => setPersonal_info({ ...personal_info, Marj_E_Taqleed: e.target.value })}
        type="text"
        required
            />
          )}
        </div>

        {/* Halafnama Agreement */}
        <div className="form-group checkbox full-width">
          <label className="halafnama-inline">
            <input
              name="halafnama"
              type="checkbox"
              checked={personal_info.halafnama}
              onChange={(e) => {
                const checked = e.target.checked;
                setPersonal_info({ ...personal_info, halafnama: checked });
                if (checked) setErrors((prev) => ({ ...prev, halafnama: undefined }));
              }}
              ref={halafnamaRef}
            />
            <span>I agree to the Halafnama</span>
          </label>
          {errors.halafnama && <small className="error">{errors.halafnama}</small>}
          <div className="agreement-box">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores nulla magnam exercitationem dolorum laudantium a, ad inventore sint officia ullam pariatur incidunt! Labore, iusto! Ex, quibusdam. Quia velit ducimus, repellat nulla quisquam labore iusto ex saepe quam odit accusantium? Ducimus quas, odit repellat et dicta tenetur odio deserunt nisi reprehenderit facere modi? Sit reiciendis eaque inventore deleniti exercitationem nisi consectetur id iusto expedita aliquam explicabo, magni modi aut aperiam corporis tenetur in eos eveniet voluptas quia. Alias eveniet doloremque labore officia, quisquam atque quae, nesciunt non voluptatum esse magni aliquam natus doloribus facilis architecto amet sapiente consectetur, voluptas quis quibusdam.
          </div>
        </div>

        <h3 className="section-title">Guardian Information</h3>

        {/* Guardian Name */}
        <div className="form-group">
          <label>Guardian Name</label>
          <input
            name="guardian_name"
            placeholder="Enter Guardian Name"
            value={guardian_info.name}
            onChange={(e) => setGuardian_info({ ...guardian_info, name: e.target.value })}
            type="text"
            required
          />
          {errors.guardian_name && <small className="error">{errors.guardian_name}</small>}
        </div>

        {/* Relationship */}
        <div className="form-group">
          <label>Relationship</label>
          <select
            name="guardian_relationship"
            value={guardian_info.relationship}
            onChange={(e) => setGuardian_info({ ...guardian_info, relationship: e.target.value })}
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
          {errors.guardian_relationship && <small className="error">{errors.guardian_relationship}</small>}
        </div>

        {/* Guardian Email */}
        <div className="form-group">
          <label>Guardian Email</label>
          <input
            name="guardian_email"
            placeholder="guardian@example.com"
            value={guardian_info.email}
            onChange={(e) => setGuardian_info({ ...guardian_info, email: e.target.value })}
            type="email"
            required
          />
          {errors.guardian_email && <small className="error">{errors.guardian_email}</small>}
        </div>

        {/* Guardian WhatsApp */}
        <div className="form-group">
          <label>Guardian WhatsApp</label>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 8 }}>
            <select
              name="guardian_whatsapp_cc"
              value={guardian_info.whatsapp_cc}
              onChange={(e) => setGuardian_info({ ...guardian_info, whatsapp_cc: e.target.value })}
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <input
              name="guardian_whatsapp_no"
              placeholder="number without country code"
              value={guardian_info.whatsapp_no}
              onChange={(e) => setGuardian_info({ ...guardian_info, whatsapp_no: e.target.value })}
              type="tel"
              required
            />
          </div>
          {errors.guardian_whatsapp_no && <small className="error">{errors.guardian_whatsapp_no}</small>}
        </div>

        {/* Guardian CNIC */}
        <div className="form-group">
          <label>Guardian CNIC</label>
          <input
            name="guardian_CNIC"
            placeholder="1234512345671"
            value={guardian_info.CNIC}
            onChange={(e) => setGuardian_info({ ...guardian_info, CNIC: e.target.value })}
            type="text"
            required
          />
          {errors.guardian_CNIC && <small className="error">{errors.guardian_CNIC}</small>}
        </div>

        {/* Guardian Address */}
        <div className="form-group full-width">
          <label>Guardian Address</label>
          <textarea
            name="guardian_address"
            rows={4}
            placeholder="Street, Area"
            value={guardian_info.address}
            onChange={(e) => setGuardian_info({ ...guardian_info, address: e.target.value })}
            required
          />
          {errors.guardian_address && <small className="error">{errors.guardian_address}</small>}
        </div>

        <h3 className="section-title">Academic Information</h3>

        {/* Academic Class */}
        <div className="form-group">
          <label>Academic Class</label>
          <input
            name="academic_class"
            placeholder="Enter Class/Grade"
            value={academic_progress.academic_class}
            onChange={(e) => setAcademic_progress({ ...academic_progress, academic_class: e.target.value })}
            type="number"
            min={1}
            step={1}
            required
          />
          {errors.academic_class && <small className="error">{errors.academic_class}</small>}
        </div>

        {/* Institute Name */}
        <div className="form-group">
          <label>Institute Name</label>
          <input
            name="institute_name"
            placeholder="Enter Institute/School"
            value={academic_progress.institute_name}
            onChange={(e) => setAcademic_progress({ ...academic_progress, institute_name: e.target.value })}
            type="text"
            required
          />
          {errors.institute_name && <small className="error">{errors.institute_name}</small>}
        </div>

        {/* In Progress */}
        <div className="form-group checkbox full-width">
          <label className="halafnama-inline">
            <input
              name="inProgress"
              type="checkbox"
              checked={academic_progress.inProgress}
              onChange={(e) => setAcademic_progress({ ...academic_progress, inProgress: e.target.checked })}
            />
            Currently in progress
          </label>
        </div>

        {/* Result */}
        <div className="form-group">
          <label>Result</label>
          <input
            name="result"
            placeholder={academic_progress.inProgress ? "N/A while in progress" : "Enter Result/Grade"}
            value={academic_progress.result ?? ""}
            onChange={(e) => setAcademic_progress({ ...academic_progress, result: e.target.value })}
            type="text"
            disabled={academic_progress.inProgress}
            required={!academic_progress.inProgress}
          />
          {errors.result && <small className="error">{errors.result}</small>}
        </div>

        {/* Submit */}
        <div className="form-actions full-width">
          <button type="submit">Submit Application</button>
        </div>
      </form>
    </div>
  );
}