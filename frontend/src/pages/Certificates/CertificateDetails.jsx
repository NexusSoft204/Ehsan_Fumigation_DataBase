import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Barcode from 'react-barcode';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';



const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }

  return null;
};

function CertificateDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Certificate ID:", id);
  

  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        setError('');

        /*
          اگر endpoint پروژه شما متفاوت است،
          فقط این URL را تغییر دهید.
        */
       const token = getCookie("token");
        const response = await axios.get(
            `http://127.0.0.1:8000/api/certificates/${id}/`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
        );

        setCertData(response.data);

      } catch (err) {
        console.error('Certificate details error:', err);

        setError(
          err.response?.data?.detail ||
          'Unable to load certificate details.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCertificate();
    }
  }, [id]);

  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#003366] border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-sm font-bold text-[#64748B]">
            Loading certificate...
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Error
  // -----------------------------

  if (error || !certData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="bg-white border border-red-200 rounded-[12px] p-8 text-center max-w-md">
          <div className="text-4xl mb-4">
            ⚠️
          </div>

          <h2 className="text-xl font-bold text-[#0F172A]">
            Certificate Not Found
          </h2>

          <p className="text-sm text-[#64748B] mt-2">
            {error || 'The requested certificate could not be found.'}
          </p>

          <button
            onClick={() => navigate('/certificates')}
            className="mt-6 px-5 py-2 bg-[#003366] text-white rounded-[8px] text-sm font-bold"
          >
            Back to Certificates
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Helpers
  // -----------------------------

  const certificateNo =
    certData.certificate_no ||
    certData.certificate_number ||
    certData.registration_no ||
    certData.id;

  const companyName =
    certData.exporter_name ||
    certData.company_name ||
    certData.companyName ||
    'N/A';

  const issueDate =
    certData.issue_date ||
    certData.issueDate ||
    'N/A';

  const fumigationDate =
    certData.fumigation_date ||
    certData.fumigationDate ||
    'N/A';

  const vehiclePlate =
    certData.vehicle_plate_number ||
    certData.vehicle_plate ||
    certData.vehiclePlateNumber ||
    'N/A';

  const containerNumber =
    certData.container_number ||
    certData.containerNumber ||
    'N/A';

  const origin =
    certData.origin ||
    'Afghanistan';

  const destinationCountry =
    certData.destination_country ||
    certData.destinationCountry ||
    'N/A';

  const portOfLoading =
    certData.port_of_loading ||
    certData.portOfLoading ||
    'N/A';

  const exporterAddress =
    certData.exporter_address ||
    certData.company_address ||
    certData.exporterAddress ||
    'N/A';

  const consigneeName =
    certData.consignee_name ||
    certData.importer_name ||
    certData.consigneeName ||
    'N/A';

  const consigneeAddress =
    certData.consignee_address ||
    certData.importer_address ||
    certData.consigneeAddress ||
    'N/A';

  const commodity =
    certData.commodity ||
    certData.product ||
    'N/A';

  const quantity =
    certData.quantity ||
    'N/A';

  const invoice =
    certData.invoice ||
    certData.invoice_number ||
    certData.bill_of_lading ||
    certData.cmr ||
    'N/A';

  const treatmentType =
    certData.treatment_type ||
    certData.fumigation_treatment_type ||
    certData.treatmentType ||
    'N/A';

  const activeIngredient =
    certData.active_ingredient ||
    certData.activeIngredient ||
    'N/A';

  const dosage =
    certData.dosage ||
    'N/A';

  const temperature =
    certData.temperature ||
    'N/A';

  const license =
    certData.license ||
    certData.license_number ||
    'N/A';

  const certificatePdf =
    certData.certificate_pdf ||
    certData.pdf ||
    certData.certificatePDF ||
    null;

  // -----------------------------
  // Print
  // -----------------------------

  const handlePrint = () => {
    window.print();
  };

  // -----------------------------
  // Format date
  // -----------------------------

  const formatDate = (date) => {
    if (!date) return 'N/A';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6 font-interBold bg-[#F8FAFC]">

      {/* Back Button */}

      <button
        onClick={() => navigate('/certificates')}
        className="flex items-center gap-2 text-sm font-bold text-[#64748B] hover:text-[#003366] transition-colors"
      >
        ← Back to Certificates
      </button>


      {/* ================================
          HEADER
      ================================= */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 bg-white p-6 rounded-[12px] border border-[#E2E8F0] shadow-sm">

        <div>

          <div className="flex items-center gap-3">

            <h2 className="text-2xl font-bold text-[#003366]">
              {certificateNo}
            </h2>

            <span className="px-3 py-0.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-[999px] uppercase tracking-wider">
              ● Valid
            </span>

          </div>

          <h3 className="text-lg font-bold text-[#0F172A] mt-2">
            {companyName}
          </h3>

          <p className="text-sm text-[#64748B] mt-0.5">
            Issued: {formatDate(issueDate)}
          </p>

        </div>


        {/* Actions */}

        <div className="flex flex-wrap gap-2.5">

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-[8px] text-sm font-bold text-[#0F172A] hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            🖨️ Print Certificate
          </button>


          {certificatePdf && (
            <a
              href={certificatePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-[8px] text-sm font-bold text-[#0F172A] hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              📥 Download PDF
            </a>
          )}


          <button
            onClick={() => navigate('/certificates/verify')}
            className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white text-sm font-bold rounded-[8px] shadow-sm transition-all"
          >
            Verify Certificate
          </button>

        </div>

      </div>


      {/* ==========================================
          CERTIFICATE PREVIEW
      =========================================== */}

      <div className="flex justify-center items-center py-6 bg-slate-100 rounded-[12px] border border-[#E2E8F0] overflow-x-auto">

        <div
          id="printable-certificate"
          className="w-[600px] bg-white border-[12px] border-[#003366] p-10 rounded-[4px] shadow-lg relative flex flex-col items-center text-center space-y-6"
        >

          {/* Inner Border */}

          <div className="absolute inset-2 border border-slate-200 pointer-events-none"></div>


          {/* ==================================
              HEADER
          =================================== */}

          <div className="space-y-1">

            <span className="text-[10px] uppercase text-[#64748B] tracking-[0.2em] font-semibold block">
              Ehsan Saboor Management System
            </span>

            <h1 className="text-3xl font-serif font-black tracking-widest text-[#003366]">
              CERTIFICATE
            </h1>

            <div className="w-24 h-[2px] bg-[#00C8FF] mx-auto mt-2"></div>

          </div>


          {/* ==================================
              COMPANY
          =================================== */}

          <div className="space-y-2 pt-2">

            <p className="text-xs italic text-[#64748B]">
              This document officially certifies that
            </p>

            <h2 className="text-2xl font-bold text-[#0F172A]">
              {companyName}
            </h2>

            <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed">

              Has successfully fulfilled all legal frameworks,
              registration prerequisites, and operational protocols
              for the scope of

              <span className="font-semibold text-[#003366]">
                {' '}
                {treatmentType}
              </span>.

            </p>

          </div>


          {/* ==================================
              BARCODE
          =================================== */}

          <div className="pt-2 flex flex-col items-center gap-1">

            <Barcode
              value={String(certificateNo)}
              format="CODE128"
              width={1.6}
              height={45}
              displayValue={false}
              background="transparent"
            />

            <span className="text-xs font-mono font-bold tracking-wider text-slate-800">
              Certificate No: {certificateNo}
            </span>

          </div>


          {/* ==================================
              CERTIFICATE INFORMATION
          =================================== */}

          <div className="w-full border-t border-slate-100 pt-4">

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-left">

              <div>
                <span className="text-[10px] text-[#64748B] block">
                  Issue Date
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {formatDate(issueDate)}
                </span>
              </div>


              <div>
                <span className="text-[10px] text-[#64748B] block">
                  Fumigation Date
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {formatDate(fumigationDate)}
                </span>
              </div>


              <div>
                <span className="text-[10px] text-[#64748B] block">
                  Vehicle Plate
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {vehiclePlate}
                </span>
              </div>


              <div>
                <span className="text-[10px] text-[#64748B] block">
                  Container No
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {containerNumber}
                </span>
              </div>


              <div>
                <span className="text-[10px] text-[#64748B] block">
                  Origin
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {origin}
                </span>
              </div>


              <div>
                <span className="text-[10px] text-[#64748B] block">
                  Destination
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {destinationCountry}
                </span>
              </div>


              <div>
                <span className="text-[10px] text-[#64748B] block">
                  Port of Loading
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {portOfLoading}
                </span>
              </div>


              <div>
                <span className="text-[10px] text-[#64748B] block">
                  Commodity
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {commodity}
                </span>
              </div>


              <div>
                <span className="text-[10px] text-[#64748B] block">
                  Quantity
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {quantity}
                </span>
              </div>


              <div>
                <span className="text-[10px] text-[#64748B] block">
                  Invoice / BL / CMR
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {invoice}
                </span>
              </div>

            </div>

          </div>


          {/* ==================================
              FUMIGATION INFORMATION
          =================================== */}

          <div className="w-full border-t border-slate-100 pt-4 text-left">

            <h3 className="text-xs font-bold text-[#003366] uppercase tracking-wider mb-3">
              Fumigation Treatment
            </h3>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">

              <div>
                <span className="text-[10px] text-[#64748B] block">
                  Treatment Type
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {treatmentType}
                </span>
              </div>


              <div>
                <span className="text-[10px] text-[#64748B] block">
                  Active Ingredient
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {activeIngredient}
                </span>
              </div>


              <div>
                <span className="text-[10px] text-[#64748B] block">
                  Dosage
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {dosage}
                </span>
              </div>


              <div>
                <span className="text-[10px] text-[#64748B] block">
                  Temperature
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {temperature}
                </span>
              </div>


              <div>
                <span className="text-[10px] text-[#64748B] block">
                  License
                </span>

                <span className="text-xs font-bold text-[#0F172A]">
                  {license}
                </span>
              </div>

            </div>

          </div>


          {/* ==================================
              EXPORTER / CONSIGNEE
          =================================== */}

          <div className="w-full border-t border-slate-100 pt-4 grid grid-cols-2 gap-5 text-left">

            <div>

              <span className="text-[10px] text-[#64748B] block">
                Exporter / Company
              </span>

              <p className="text-xs font-bold text-[#0F172A]">
                {companyName}
              </p>

              <p className="text-[10px] text-[#64748B] mt-1">
                {exporterAddress}
              </p>

            </div>


            <div>

              <span className="text-[10px] text-[#64748B] block">
                Consignee / Importer
              </span>

              <p className="text-xs font-bold text-[#0F172A]">
                {consigneeName}
              </p>

              <p className="text-[10px] text-[#64748B] mt-1">
                {consigneeAddress}
              </p>

            </div>

          </div>


          {/* ==================================
              FOOTER + QR
          =================================== */}

          <div className="w-full flex justify-between items-end pt-4 border-t border-slate-100 text-left">

            <div className="space-y-1">

              <span className="text-[11px] text-[#64748B] block">
                Date of Issuance:
              </span>

              <span className="text-sm font-bold text-[#0F172A]">
                {formatDate(issueDate)}
              </span>


              <span className="text-[11px] text-[#64748B] block pt-2">
                Fumigation Date:
              </span>

              <span className="text-xs font-bold text-[#0F172A]">
                {formatDate(fumigationDate)}
              </span>

            </div>


            {/* QR */}

            <div className="bg-white p-2 border border-slate-200 rounded-[6px]">

              <QRCodeSVG
                value={`https://ehsansaboor.com/certificates/verify/${certificateNo}`}
                size={70}
                fgColor="#003366"
                level="M"
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CertificateDetails;