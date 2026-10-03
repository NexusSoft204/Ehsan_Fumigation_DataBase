import React, { useEffect, useState } from "react";
import axios from "axios";

function VerifyCertificate() {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams(
          window.location.search
        );

        const certificateNumber =
          params.get("certificate");

        if (!certificateNumber) {
          setError("Certificate number was not provided.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/certificates/verify/`,
          {
            params: {
              certificate: certificateNumber,
            },
          }
        );

        setCertificate(response.data);

      } catch (error) {
        console.error(
          "Certificate verification error:",
          error
        );

        if (error.response?.status === 404) {
          setError(
            "This certificate could not be found."
          );
        } else {
          setError(
            "Unable to verify this certificate."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    verifyCertificate();
  }, [API_URL]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

          <div className="w-12 h-12 border-4 border-slate-200 border-t-green-600 rounded-full animate-spin mx-auto mb-5" />

          <h2 className="text-xl font-semibold text-slate-800">
            Verifying Certificate
          </h2>

          <p className="text-slate-500 mt-2">
            Please wait while we verify this certificate.
          </p>

        </div>

      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">

          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto">
            !
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mt-5">
            Certificate Not Found
          </h1>

          <p className="text-slate-500 mt-3">
            {error}
          </p>

          <p className="text-sm text-slate-400 mt-5">
            Please make sure you scanned a valid certificate QR code.
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

          <div className="bg-gradient-to-r from-green-700 to-green-500 px-6 md:px-10 py-8 text-white">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>

                <p className="text-sm uppercase tracking-widest opacity-80">
                  Certificate Verification
                </p>

                <h1 className="text-2xl md:text-3xl font-bold mt-2">
                  Fumigation Certificate
                </h1>

                <p className="mt-2 text-green-50">
                  Ehsan Saboor Trading Company Fumigation Center
                </p>

              </div>

              <div className="bg-white text-green-700 rounded-2xl px-5 py-4 text-center">

                <div className="text-xs uppercase tracking-wide">
                  Status
                </div>

                <div className="font-bold text-lg mt-1">
                  ✓ VERIFIED
                </div>

              </div>

            </div>

          </div>

          {/* CERTIFICATE NUMBER */}

          <div className="px-6 md:px-10 py-6 border-b border-slate-200">

            <div className="grid md:grid-cols-3 gap-5">

              <InfoBox
                title="Certificate Number"
                value={certificate.certificateNumber}
              />

              <InfoBox
                title="Issue Date"
                value={certificate.issueDate}
              />

              <InfoBox
                title="Registration Number"
                value={certificate.registrationNo}
              />

            </div>

          </div>

          <div className="p-6 md:p-10">

            {/* TARGET */}

            <Section title="Target of Fumigation">

              <div className="grid md:grid-cols-2 gap-5">

                <InfoBox
                  title="Commodity"
                  value={certificate.commodity}
                />

                <InfoBox
                  title="Quantity"
                  value={certificate.quantity}
                />

                <InfoBox
                  title="Country of Origin"
                  value={certificate.countryOfOrigin}
                />

                <InfoBox
                  title="Destination Country"
                  value={certificate.countryOfDestination}
                />

                <InfoBox
                  title="Port of Loading"
                  value={certificate.portOfLoading}
                />

                <InfoBox
                  title="Consignment Link"
                  value={certificate.consignmentLink}
                />

              </div>

            </Section>

            {/* EXPORTER */}

            <Section title="Exporter">

              <div className="grid md:grid-cols-2 gap-5">

                <InfoBox
                  title="Company / Exporter"
                  value={certificate.exporterName}
                />

                <InfoBox
                  title="Address"
                  value={certificate.exporterAddress}
                />

              </div>

            </Section>

            {/* IMPORTER */}

            <Section title="Importer / Consignee">

              <div className="grid md:grid-cols-2 gap-5">

                <InfoBox
                  title="Company / Importer"
                  value={certificate.importerName}
                />

                <InfoBox
                  title="Address"
                  value={certificate.importerAddress}
                />

              </div>

            </Section>

            {/* VEHICLE */}

            <Section title="Vehicle & Transport">

              <div className="grid md:grid-cols-2 gap-5">

                <InfoBox
                  title="Vehicle Plate Number"
                  value={certificate.plateNo}
                />

                <InfoBox
                  title="Container Number"
                  value={certificate.containerNumber}
                />

              </div>

            </Section>

            {/* FUMIGATION */}

            <Section title="Treatment & Fumigation">

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                <InfoBox
                  title="Treatment Type"
                  value={certificate.treatmentType}
                />

                <InfoBox
                  title="Fumigant"
                  value={certificate.fumigantType}
                />

                <InfoBox
                  title="Prescribed Dose"
                  value={certificate.prescribedDose}
                />

                <InfoBox
                  title="Applied Dose"
                  value={certificate.appliedDose}
                />

                <InfoBox
                  title="Temperature"
                  value={certificate.minTemperature}
                />

                <InfoBox
                  title="Exposure Period"
                  value={certificate.exposurePeriod}
                />

                <InfoBox
                  title="Fumigation Date"
                  value={certificate.dateOfFumigation}
                />

                <InfoBox
                  title="Place of Fumigation"
                  value={certificate.placeOfFumigation}
                />

                <InfoBox
                  title="Fumigator License"
                  value={certificate.fumigatorLicense}
                />

              </div>

            </Section>

            {/* DOCUMENTS */}

            <Section title="Documents">

              <div className="grid md:grid-cols-2 gap-5">

                <InfoBox
                  title="Exporter Invoice Number"
                  value={certificate.exporterInvoiceNo}
                />

                <InfoBox
                  title="Bill of Lading / CMR"
                  value={certificate.billOfLadingNo}
                />

              </div>

            </Section>

            {/* ACCREDITATION */}

            <Section title="Accreditation">

              <div className="grid md:grid-cols-2 gap-5">

                <InfoBox
                  title="Accreditation Number"
                  value={certificate.accreditationNumber}
                />

                <InfoBox
                  title="Verification Status"
                  value="VALID CERTIFICATE"
                  verified
                />

              </div>

            </Section>

            {/* FOOTER */}

            <div className="mt-10 pt-6 border-t border-slate-200 text-center">

              <p className="text-sm text-slate-500">
                This certificate was verified electronically
                through the official certificate verification system.
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Ehsan Saboor Trading Company Fumigation Center
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}


/* =====================================================
   INFO BOX
===================================================== */

function InfoBox({
  title,
  value,
  verified = false,
}) {

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

      <p className="text-xs uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p
        className={`mt-2 font-semibold ${
          verified
            ? "text-green-600"
            : "text-slate-800"
        }`}
      >
        {value || "—"}
      </p>

    </div>
  );
}


/* =====================================================
   SECTION
===================================================== */

function Section({ title, children }) {

  return (
    <section className="mb-10">

      <div className="flex items-center gap-3 mb-5">

        <div className="w-1 h-7 bg-green-600 rounded-full" />

        <h2 className="text-xl font-bold text-slate-800">
          {title}
        </h2>

      </div>

      {children}

    </section>
  );
}


export default VerifyCertificate;