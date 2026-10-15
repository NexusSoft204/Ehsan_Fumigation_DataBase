import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import html2pdf from "html2pdf.js";
import "../../style.css"; 

function IssueCertificate() {
  const navigate = useNavigate();
  const printAreaRef = useRef(null);

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL

  const VERIFY_URL =
  import.meta.env.VITE_CERTIFICATE_VERIFY_URL ||
  `${window.location.origin}/certificates/verify/`;

  const [formData, setFormData] = useState({
    /* =====================================================
       CERTIFICATE INFORMATION
    ===================================================== */

    certificateNumber: "ESFC-MB-HRT-0643 2026-09-05",
    issueDate: "2026-09-05",
    phytosanitaryNo: "",
    registrationNo: "005-022-11",
    company: null,

    /* =====================================================
       TARGET / CONSIGNMENT
    ===================================================== */

    targetCommodity: true,
    targetPacking: false,
    targetBoth: true,
    targetContainer: false,

    commodity: "FRESH ONIONS",
    quantity: "1090 BAGS, NET WT: 27150 KGS",

    consignmentLink: "21... 05/09/2026",

    countryOfOrigin: "AFGHANISTAN",
    portOfLoading: "HERAT",
    countryOfDestination: "PAKISTAN",

    /* =====================================================
       EXPORTER / IMPORTER
    ===================================================== */

    exporterName: "SALAHADDIN ESHAQZAYE S/O ABDUL ZAHER",
    exporterAddress:
      "T.L NO: 96082 NIMROOZ, AFGHANISTAN",

    importerName: "KHAIR INTERPRISE",
    importerAddress:
      "PAKISTAN-AL HAFIZ +923333452250",

    /* =====================================================
       FUMIGATION
    ===================================================== */

    treatmentType: "FUMIGATION",

    fumigantType: "METHYL BROMIDE",
    phosphine: false,

    dateOfFumigation: "2026-09-05",

    placeOfFumigation: "HERAT",

    prescribedDose: "32 GMS/M3",

    exposurePeriod: "12 HOURS",

    minTemperature: "21 DEG. CELSIUS",

    appliedDose: "32 GMS/M3",

    fumigationMethod: "Un-sheeted Container",

    chamber: false,
    underTarpaulin: false,
    unSheetedContainer: true,
    testedContainers: false,
    sheetedContainers: false,
    sheetedStack: false,

    timberRequirements: true,
    timberRequirementsNo: false,

    ventilationTlv: "2",

    /* =====================================================
       ADDITIONAL
    ===================================================== */

    exporterInvoiceNo: "21.",
    billOfLadingNo: "",
    plateNo: "",
    containerNumber: "",

    fumigatorLicense: "",
    accreditationNumber: "022-025-09",

    /* =====================================================
       DECLARATION
    ===================================================== */

    declarationText:
      "By signing below, I, the accredited fumigation operator, hereby declare that these details are true and correct and the Fumigation has been carried out in accordance with all the requirements in the Fumigation Method.",

    /* =====================================================
       FOOTER
    ===================================================== */

    address: "Herat, Afghanistan",
    contacts: "+93 (0) 707809003 / +93 (0) 706 855 866",
    email: " info@ehsansaboorltd.com",
    website: "www.ehsansaboorltd.com",
  });

  /* =====================================================
     LOAD COMPANIES
  ===================================================== */

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/companies/`
        );

        setCompanies(response.data);
      } catch (error) {
        console.error("Company loading error:", error);
      }
    };

    fetchCompanies();
  }, [API_URL]);


  const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const saveCrt = async () => {
  try {
    const token = getCookie("token");

    if (!token) {
      alert("توکن احراز هویت یافت نشد! لطفا دوباره لاگین کنید.");
      navigate("/login");
      return;
    }

    const dataToSend = {
      ...formData,
    };

    const response = await fetch(`${API_URL}/api/certificates/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(dataToSend),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Certificate save error:", data);

      alert("ذخیره Certificate موفق نبود.");
      return;
    }

    console.log("Saved Certificate:", data);

    alert("گواهی با موفقیت ذخیره شد!");

  } catch (error) {
    console.error("خطا در ارتباط با سرور:", error);
    alert("مشکلی در اتصال به سرور پیش آمده است.");
  }
};


  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =====================================================
     COMPANY SELECT
  ===================================================== */

 const handleCompanyChange = (e) => {
  const selectedId = e.target.value;

  // پیدا کردن کل اطلاعات شرکت انتخاب شده برای پر کردن خودکار نام و آدرس (اختیاری)
  const foundCompany = companies.find(c => c.id == selectedId);

  setFormData((prev) => ({
    ...prev,
    // ۱. مقدار آیدی را به عدد تبدیل کرده و در کلید company ذخیره می‌کنیم
    company: selectedId ? Number(selectedId) : null,
    
    // ۲. پر کردن خودکار فیلدهای صادرکننده بر اساس شرکت انتخاب شده
    exporterName: foundCompany ? foundCompany.company_name : "",
    exporterAddress: foundCompany ? foundCompany.address : "",
  }));
};


  /* =====================================================
     DOWNLOAD PDF
  ===================================================== */

  const handleDownloadPDF = async () => {
    const element = printAreaRef.current;

    if (!element) return;

    setLoading(true);

    try {
      const options = {
        margin: 0,

        filename: `Fumigation-Certificate-${formData.certificateNumber}.pdf`,

        image: {
          type: "jpeg",
          quality: 0.98,
        },

        html2canvas: {
          scale: 3,
          useCORS: true,
          allowTaint: false,
          logging: false,

          backgroundColor: "#ffffff",

          width: element.scrollWidth,
          height: element.scrollHeight,
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },

        pagebreak: {
          mode: ["avoid-all"],
        },
      };

      await html2pdf()
        .set(options)
        .from(element)
        .save();
    } catch (error) {
      console.error(error);
      alert("PDF generation failed.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     CHECKBOX
  ===================================================== */

  const PrintCheckbox = ({ checked }) => (
    <span className="print-checkbox" style={{fontSize:'19px'}}>
      {checked ? "☑" : "☐"}
    </span>
  );

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="certificate-page">

      {/* =================================================
          TOP CONTROL BAR
      ================================================= */}

      <div className="control-bar no-print flex flex-col md:flex-row md:justify-between">

        <div>
          <h2>Official Certificate Builder</h2>

          <p>
            Fumigation Certificate — A4 Official Layout
          </p>
        </div>

        <div className="control-buttons">

          <button
            type="button"
            onClick={() => navigate("/companies")}
            className="btn-back font-interBold"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="btn-pdf font-interBold"
            disabled={loading}
          >
            {loading
              ? "Generating..."
              : "⬇ Download PDF"}
          </button>
           
          <button 
            onClick={saveCrt}
            type="submit"
            className="py-3 px-8 bg-Accent text-white font-inter-Thin cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="main-layout">

        {/* =================================================
            LEFT EDITOR
        ================================================= */}

        <div className="editor-panel no-print w-full">

          <h3>Live Editor</h3>
 
          {/* COMPANY */}

          <div className="editor-group">

            <label>Select Exporter / Company</label>

            <select 
              value={formData.company || ""}
              onChange={handleCompanyChange}>

              <option value="">
                Choose registered company...
              </option>

              {companies.map((company) => (
                <option
                  key={company.id}
                  value={company.id}
                >
                  {company.company_name}
                </option>
              ))}

            </select>

          </div>

          {/* CERTIFICATE */}

          <div className="editor-title">
            Certificate Information
          </div>

          <div className="two-columns">

            <EditorInput
              label="Certificate No."
              name="certificateNumber"
              value={formData.certificateNumber}
              onChange={handleChange}
            />

            <EditorInput
              label="Registration No."
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
            />

            <EditorInput
              label="Issue Date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
            />

            <EditorInput
              label="Phytosanitary No."
              name="phytosanitaryNo"
              value={formData.phytosanitaryNo}
              onChange={handleChange}
            />

          </div>

          {/* VEHICLE */}

          <div className="editor-title">
            Vehicle / Transport
          </div>

          <div className="two-columns">

            <EditorInput
              label="Vehicle Plate Number"
              name="plateNo"
              value={formData.plateNo}
              onChange={handleChange}
            />

            <EditorInput
              label="Container Number"
              name="containerNumber"
              value={formData.containerNumber}
              onChange={handleChange}
            />

          </div>

          {/* ORIGIN */}

          <div className="editor-title">
            Shipment Information
          </div>

          <div className="two-columns">

            <EditorInput
              label="Origin"
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleChange}
            />

            <EditorInput
              label="Destination Country"
              name="countryOfDestination"
              value={formData.countryOfDestination}
              onChange={handleChange}
            />

            <EditorInput
              label="Port of Loading"
              name="portOfLoading"
              value={formData.portOfLoading}
              onChange={handleChange}
            />

            <EditorInput
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />

          </div>

          <EditorInput
            label="Commodity / Product"
            name="commodity"
            value={formData.commodity}
            onChange={handleChange}
          />

          <EditorInput
            label="Consignment Link"
            name="consignmentLink"
            value={formData.consignmentLink}
            onChange={handleChange}
          />

          {/* EXPORTER */}

          <div className="editor-title">
            Exporter
          </div>

          <EditorInput
            label="Exporter / Company Name"
            name="exporterName"
            value={formData.exporterName}
            onChange={handleChange}
          />

          <EditorTextarea
            label="Company Address"
            name="exporterAddress"
            value={formData.exporterAddress}
            onChange={handleChange}
          />

          {/* IMPORTER */}

          <div className="editor-title">
            Consignee / Importer
          </div>

          <EditorInput
            label="Importer Name"
            name="importerName"
            value={formData.importerName}
            onChange={handleChange}
          />

          <EditorTextarea
            label="Importer Address"
            name="importerAddress"
            value={formData.importerAddress}
            onChange={handleChange}
          />

          {/* FUMIGATION */}

          <div className="editor-title">
            🧪 Fumigation / Treatment
          </div>

          <div className="two-columns">

            <EditorInput
              label="Treatment Type"
              name="treatmentType"
              value={formData.treatmentType}
              onChange={handleChange}
            />

            <EditorInput
              label="Fumigant / Active Ingredient"
              name="fumigantType"
              value={formData.fumigantType}
              onChange={handleChange}
            />

            <EditorInput
              label="Dosage / Concentration"
              name="prescribedDose"
              value={formData.prescribedDose}
              onChange={handleChange}
            />

            <EditorInput
              label="Applied Dose"
              name="appliedDose"
              value={formData.appliedDose}
              onChange={handleChange}
            />

            <EditorInput
              label="Temperature"
              name="minTemperature"
              value={formData.minTemperature}
              onChange={handleChange}
            />

            <EditorInput
              label="Exposure Period"
              name="exposurePeriod"
              value={formData.exposurePeriod}
              onChange={handleChange}
            />

            <EditorInput
              label="Fumigation Date"
              name="dateOfFumigation"
              value={formData.dateOfFumigation}
              onChange={handleChange}
            />

            <EditorInput
              label="Place of Fumigation"
              name="placeOfFumigation"
              value={formData.placeOfFumigation}
              onChange={handleChange}
            />

            <EditorInput
              label="Fumigator License"
              name="fumigatorLicense"
              value={formData.fumigatorLicense}
              onChange={handleChange}
            />

            <EditorInput
              label="Accreditation Number"
              name="accreditationNumber"
              value={formData.accreditationNumber}
              onChange={handleChange}
            />

          </div>

          {/* INVOICE */}

          <div className="editor-title">
            Documents
          </div>

          <div className="two-columns">

            <EditorInput
              label="Invoice No."
              name="exporterInvoiceNo"
              value={formData.exporterInvoiceNo}
              onChange={handleChange}
            />

            <EditorInput
              label="Bill of Lading / CMR"
              name="billOfLadingNo"
              value={formData.billOfLadingNo}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* =================================================
            CERTIFICATE
        ================================================= */}

        <div className="preview-wrapper w-full">

          <div
            ref={printAreaRef}
            className="certificate"
          >

            {/* ============================================
                HEADER
            ============================================ */}

            <div className="certificate-header mb-3">

              <div className="logo-wrapper">

                <img
                  src="/images/ehsan-logo.jpeg"
                  alt="ehsan saboor"
                  className="company-logo "
                />

              </div>

              <div className="company-heading">

                <div>
                  EHSAN SOBOOR LTD
                </div>

                <div>
                  (ESFC)
                </div>

              </div>

            </div>

            {/* GREEN TITLE BAR */}

            <div className="title-bar">

              <div className="title-arrow">
                <span>FUMIGATION CERTIFICATE</span>
              </div>

            </div>

            {/* ============================================
                CERTIFICATE NUMBERS
            ============================================ */}

            <div className="certificate-numbers">

              <div className="number-box">

                <strong>Certificate#:</strong>

                <span>  
                  {formData.certificateNumber}
                </span>

              </div>

              <div className="number-box">

                <strong>
                  Phytosanitary
                  <br />
                  Certificate#:
                </strong>

                <span>
                  {formData.phytosanitaryNo || ""}
                </span>

              </div>

              <div className="number-box">

                <strong>Registration#:</strong>

                <span>
                  {formData.registrationNo}
                </span>

              </div>

            </div>

            {/* ============================================
                TARGET TITLE
            ============================================ */}

            <SectionTitle>
              TARGET OF FUMIGATION DETAILS
            </SectionTitle>

            {/* TARGET CHECKBOXES */}

            <div className="target-line">

              <strong>
                Target of Fumigation Details
              </strong>

              <span>
                <PrintCheckbox
                  checked={formData.targetCommodity}
                />
                Commodity
              </span>

              <span>
                <PrintCheckbox
                  checked={formData.targetPacking}
                />
                Packing
              </span>

              <span>
                <PrintCheckbox
                  checked={formData.targetBoth}
                />
                 Commodity & Packing
              </span>

              <span>
                <PrintCheckbox
                  checked={formData.targetContainer}
                />
                Container
              </span>

            </div>

            {/* ============================================
                COMMODITY
            ============================================ */}

            <div className="info-row">

              <strong>Commodity:</strong>

              <span>
                {formData.commodity}
              </span>

            </div>

            <div className="info-row">

              <strong>Quantity:</strong>

              <span>
                {formData.quantity}
              </span>

            </div>

            <div className="info-row">

              <strong>Consignment link:</strong>

              <span>
                {formData.consignmentLink}
              </span>

            </div>

            {/* ============================================
                ORIGIN DESTINATION
            ============================================ */}

            <div className="three-column-row">

              <div>

                <strong>
                  Country of origin:
                </strong>

                <span>
                  {formData.countryOfOrigin}
                </span>

              </div>

              <div>

                <strong>
                  Port of loading:
                </strong>

                <span>
                  {formData.portOfLoading}
                </span>

              </div>

              <div>

                <strong>
                  Country of destination:
                </strong>

                <span>
                  {formData.countryOfDestination}
                </span>

              </div>

            </div>

            {/* ============================================
                EXPORTER / IMPORTER
            ============================================ */}

            <div className="party-grid">

              <div className="party-column">

                <strong className="font-interBold">
                  Name and address of EXPORTER:
                </strong>

                <div className="name-exporter font-inter-Thin">
                  {formData.exporterName}
                </div>

                <div>
                  {formData.exporterAddress}
                </div>

              </div>

              <div className="party-column font-interBold">

                <strong>
                  Name and address of IMPORTER:
                </strong>

                <div className="name-importer font-inter-Thin">
                  {formData.importerName}
                </div>

                <div>
                  {formData.importerAddress}
                </div>

              </div>

            </div>

            {/* ============================================
                TREATMENT DETAILS
            ============================================ */}

            <SectionTitle>
              TREATMENT DETAILS
            </SectionTitle>

            {/* ROW 1 */}

            <div className="treatment-grid">

              <div>

                <strong className="font-interBold">
                  Fumigant Type:
                </strong>

                <PrintCheckbox
                  checked={
                    formData.fumigantType ===
                    "METHYL BROMIDE"
                  }
                />

                METHYL BROMIDE

                <span className="treatment-option">

                  <PrintCheckbox
                    checked={formData.phosphine}
                  />

                  PHOSTAXIN (AIP)

                </span>

              </div>

              <div>

                <strong className="font-interBold">
                  Date of Fumigation:
                </strong>

                {formData.dateOfFumigation}

              </div>

            </div>

            {/* ROW 2 */}

            <div className="treatment-grid">

              <div>

                <strong className="font-interBold">
                  Place of Certificate issued Fumigation Performed:
                </strong>

                {formData.placeOfFumigation}

              </div>


            </div>

            {/* ROW 3 */}

            <div className="treatment-grid">

              <div>

                <strong className="font-interBold">
                  Prescribed dose rate (g/m³):
                </strong>

                <span className="font-inter-Thin">
                  {formData.prescribedDose}
                </span>

              </div>

              <div>

                <strong className="font-interBold">
                  Exposure period (hrs):
                </strong>

                <span className="font-inter-Thin">
                  {formData.exposurePeriod}
                </span>

              </div>

            </div>

            {/* ROW 4 */}

            <div className="treatment-grid">

              <div>

                <strong className="font-interBold">
                  Forecast minimum temp (°C):
                </strong>

                <span className="font-inter-Thin">
                  {formData.minTemperature}
                </span>

              </div>

              <div>

                <strong className="font-interBold ">
                  Applied dose rate (g/m³):
                </strong>

                <span className="font-inter-Thin">
                  {formData.appliedDose}
                </span>

              </div>

            </div>

            {/* ============================================
                FUMIGATION METHOD
            ============================================ */}

            <div className="method-section">

              <div>
                <strong className="font-interBold">
                  How was the fumigation conducted:
                </strong>

                <span className="font-inter-Thin">
                  <PrintCheckbox
                    checked={formData.unSheetedContainer}
                  />
                  Un-sheeted Container
                </span>

                <span className="font-inter-Thin">
                  <PrintCheckbox
                    checked={formData.sheetedContainers}
                  />
                  Sheeted Container/s
                </span>
              </div>

              <div>
                  <span className="font-inter-Thin">
                    <PrintCheckbox
                      checked={formData.chamber}
                    />
                    Chamber
                  </span>

                  <span className="font-inter-Thin">
                    <PrintCheckbox
                      checked={formData.underTarpaulin}
                    />
                    Under Tarpaulin
                  </span>

              

                  <span className="font-inter-Thin">
                    <PrintCheckbox
                      checked={formData.testedContainers}
                    />
                    Pressure tested container/s
                  </span>

              

                  <span className="font-inter-Thin">
                    <PrintCheckbox
                      checked={formData.sheetedStack}
                    />
                    Sheeted Stack
                  </span>
              </div>
              

            </div>

            {/* ============================================
                TIMBER
            ============================================ */}

            <div className="timber-row">

              <div className="font-inter-Thin">

                Does the target of fumigation conform to
                the plastic wrapping, <br /> immersion surface
                and timber thickness requirements at the
                time of fumigation?

              </div>

              <div className="text-cheked font-interBold">

                <PrintCheckbox
                  checked={formData.timberRequirements}
                />

                Yes

                <span className="yes-no-space" />

                <PrintCheckbox
                  checked={formData.timberRequirementsNo}
                />

                No

              </div>

            </div>

            {/* ============================================
                VENTILATION
            ============================================ */}

            <div className="ventilation-row">

              <strong className="font-interBold">
                Ventilation Final TLV reading (ppm):
              </strong>

              {formData.ventilationTlv}

              <span className="font-inter-Thin">
                (not required for stack or permanent
                chamber Fumigation)
              </span>

            </div>

            {/* ============================================
                DECLARATIONS
            ============================================ */}

            <SectionTitle>
              DECLARATIONS
            </SectionTitle>

            <div className="declaration font-inter-Thin">

              {formData.declarationText}

            </div>

            {/* ============================================
                ADDITIONAL DECLARATIONS
            ============================================ */}

            <SectionTitle>
              ADDITIONAL DECLARATIONS
            </SectionTitle>

            <div className="additional-row">

              <div>

                <strong className="font-interBold">
                  Exporter Invoice No:
                </strong>

                {formData.exporterInvoiceNo}

              </div>

              <div>

                <strong className="font-interBold">
                  PLATE#:
                </strong>

                {formData.plateNo}

              </div>

            </div>

            {/* ============================================
                SIGNATURE / QR / ACCREDITATION
            ============================================ */}

            <div className="signature-area">

              {/* SIGNATURE */}

              <div className="signature-column">

                <div className="signature-space">

                  <span className="fake-signature">
                    
                  </span>

                </div>

                <strong className="font-interBold">
                  Name of Accredited Fumigator
                </strong>

              </div>

              {/* QR */}

              <div className="qr-column">

                <QRCodeSVG
                    value={`${VERIFY_URL}?certificate=${encodeURIComponent(
                      formData.certificateNumber
                    )}`}
                    size={92}
                    level="M"
                    includeMargin={false}
                />

                <div className="qr-caption font-interBold">

                  Certificate without Barcode, Sign,
                  and Stamp is not valid.

                </div>

              </div>

              {/* DATE / ACCREDITATION */}

              <div className="accreditation-column">

                <div>
                  {formData.dateOfFumigation}
                </div>

                <strong className="font-interBold">Date</strong>

                <br />

                <br />

                <div>
                  {formData.accreditationNumber}
                </div>

                <strong className="font-interBold">
                  Accreditation Number
                </strong>

              </div>

            </div>

            {/* ============================================
                LIABILITY
            ============================================ */}

            <div className="liability font-inter-Thin">

              P.S. No Liability attached to the certifying
              company or its Directors or representatives
              with respect to this Certificate.

              <br />

              Recognized by: Plant Protection and
              Quarantine Directorate, Ministry of
              Agriculture, Irrigation and Livestock,
              Afghanistan

            </div>

            {/* ============================================
                FOOTER
            ============================================ */}

            <div className="certificate-footer">

              <div>
                <span className="font-interBold">Address:</span> {formData.address}
              </div>

              <div>
                <span className="font-interBold">
                    Contacts:
                </span>
                  {formData.contacts}
              </div>

              <div>
                <span className="font-interBold">E-mail:</span> {formData.email}
              </div>

              <div>
                <span className="font-interBold">Web:</span> {formData.website}
              </div>

            </div>

            <div className="footer-lines">

              <div className="footer-gray" />

              <div className="footer-green" />

              <div className="footer-gray" />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   EDITOR INPUT
===================================================== */

function EditorInput({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div className="editor-group">

      <label>{label}</label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
      />

    </div>
  );
}

/* =====================================================
   EDITOR TEXTAREA
===================================================== */

function EditorTextarea({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div className="editor-group">

      <label>{label}</label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={2}
      />

    </div>
  );
}

/* =====================================================
   SECTION TITLE
===================================================== */

function SectionTitle({ children }) {
  return (
    <div className="section-title" style={{fontFamily:'var(--font-interBold)'}}>
      {children}
    </div>
  );
}

export default IssueCertificate;