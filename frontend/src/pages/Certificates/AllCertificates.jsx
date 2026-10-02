import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }

  return null;
};

function AllCertificates() {
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000";

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  const [activeMenuId, setActiveMenuId] = useState(null);

  /* =====================================================
     FETCH CERTIFICATES
  ===================================================== */

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError("");
        const token = getCookie("token");
        const response = await axios.get(
              `${API_URL}/api/certificates/`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
        );

        const data = response.data;

        if (Array.isArray(data)) {
          setCertificates(data);
        } else if (Array.isArray(data.results)) {
          setCertificates(data.results);
        } else {
          setCertificates([]);
        }

      } catch (error) {
        console.error(
          "Certificate loading error:",
          error
        );

        setError(
          "Unable to load certificates from the server."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [API_URL]);


  /* =====================================================
     ACTION MENU
  ===================================================== */

  const toggleActionMenu = (id) => {
    if (activeMenuId === id) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(id);
    }
  };


  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  /* =====================================================
     STATUS
  ===================================================== */

  const getCertificateStatus = (cert) => {

    /*
      اگر Backend خودش status داشته باشد
      همان را استفاده می‌کنیم.
    */

    if (cert.status) {
      return String(cert.status);
    }

    return "Valid";
  };


  /* =====================================================
     FILTER
  ===================================================== */

  const filteredCertificates = certificates.filter(
    (cert) => {

      const certificateNumber =
        String(
          cert.certificateNumber ||
          cert.certificate_number ||
          cert.id ||
          ""
        ).toLowerCase();

      const company =
        String(
          cert.company_name ||
          cert.company?.company_name ||
          cert.company ||
          cert.exporterName ||
          cert.exporter_name ||
          ""
        ).toLowerCase();

      const query =
        searchQuery.trim().toLowerCase();

      const status =
        getCertificateStatus(cert).toLowerCase();

      const matchesSearch =
        !query ||
        certificateNumber.includes(query) ||
        company.includes(query);

      const matchesStatus =
        !statusFilter ||
        status === statusFilter.toLowerCase();

      const matchesCompany =
        !companyFilter ||
        company === companyFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCompany
      );
    }
  );


  /* =====================================================
     COMPANIES FOR FILTER
  ===================================================== */

  const companies = [
    ...new Map(
      certificates
        .map((cert) => {

          const company =
            cert.company_name ||
            cert.company?.company_name ||
            cert.company ||
            cert.exporterName ||
            cert.exporter_name;

          return company
            ? [company, company]
            : null;

        })
        .filter(Boolean)
    ).values(),
  ];


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#F8FAFC]">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#003366] rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-[#64748B]">
            Loading certificates...
          </p>

        </div>

      </div>
    );
  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="bg-[#F8FAFC] min-h-[400px] flex items-center justify-center">

        <div className="bg-white border border-red-200 rounded-[12px] p-8 text-center max-w-md">

          <div className="text-4xl mb-3">
            ⚠️
          </div>

          <h3 className="text-lg font-bold text-red-700">
            Unable to Load Certificates
          </h3>

          <p className="text-sm text-[#64748B] mt-2">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 bg-[#003366] text-white px-5 py-2 rounded-[8px]"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="space-y-6 font-interBold bg-[#F8FAFC]">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

        <div>

          <h2 className="text-2xl font-bold text-[#003366]">
            Certificates
          </h2>

          <p className="text-sm text-[#64748B] mt-1">
            Manage and track issued official certificates
          </p>

        </div>

        <Link
          to="/certificates/issue"
          className="bg-[#003366] hover:bg-[#002244] text-white px-4 py-2.5 rounded-[8px] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>+</span>
          Issue Certificate
        </Link>

      </div>


      {/* =================================================
          SEARCH + FILTERS
      ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-[12px] border border-[#E2E8F0] shadow-sm">

        {/* SEARCH */}

        <div className="relative md:col-span-2">

          <input
            type="text"
            placeholder="Search certificate..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]"
          />

          <span className="absolute left-3 top-2.5 text-slate-400 text-sm">
            🔍
          </span>

        </div>


        {/* STATUS */}

        <div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm text-[#0F172A] focus:outline-none focus:border-[#00C8FF] cursor-pointer"
          >

            <option value="">
              Status ▼
            </option>

            <option value="valid">
              Valid
            </option>

            <option value="expired">
              Expired
            </option>

            <option value="pending">
              Pending
            </option>

          </select>

        </div>


        {/* COMPANY */}

        <div>

          <select
            value={companyFilter}
            onChange={(e) =>
              setCompanyFilter(e.target.value)
            }
            className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm text-[#0F172A] focus:outline-none focus:border-[#00C8FF] cursor-pointer"
          >

            <option value="">
              Company ▼
            </option>

            {companies.map((company) => (
              <option
                key={company}
                value={company}
              >
                {company}
              </option>
            ))}

          </select>

        </div>

      </div>


      {/* =================================================
          RESULT COUNT
      ================================================= */}

      <div className="flex justify-between items-center">

        <p className="text-sm text-[#64748B]">

          Showing{" "}
          <span className="font-bold text-[#003366]">
            {filteredCertificates.length}
          </span>{" "}
          of{" "}
          <span className="font-bold text-[#003366]">
            {certificates.length}
          </span>{" "}
          certificates

        </p>

      </div>


      {/* =================================================
          TABLE
      ================================================= */}

      <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-sm overflow-visible">

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">

                <th className="py-3.5 px-4 text-xs font-bold text-[#64748B]">
                  Certificate ID
                </th>

                <th className="py-3.5 px-4 text-xs font-bold text-[#64748B]">
                  Company
                </th>

                <th className="py-3.5 px-4 text-xs font-bold text-[#64748B]">
                  Issue Date
                </th>

                <th className="py-3.5 px-4 text-xs font-bold text-[#64748B]">
                  Status
                </th>

                <th className="py-3.5 px-4 text-xs font-bold text-[#64748B] text-center w-24">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredCertificates.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="py-12 text-center"
                  >

                    <div className="text-4xl">
                      📄
                    </div>

                    <p className="mt-3 text-sm font-bold text-[#334155]">
                      No certificates found
                    </p>

                    <p className="mt-1 text-xs text-[#64748B]">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredCertificates.map((cert) => {

                  const certificateId =
                    cert.id;

                  const certificateNumber =
                    cert.certificateNumber ||
                    cert.certificate_number ||
                    cert.id ||
                    "—";

                  const company =
                    cert.company_name ||
                    cert.company?.company_name ||
                    cert.company ||
                    cert.exporterName ||
                    cert.exporter_name ||
                    "—";

                  const issueDate =
                    cert.issueDate ||
                    cert.issue_date;

                  const status =
                    getCertificateStatus(cert);

                  return (

                    <tr
                      key={certificateId}
                      className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors"
                    >

                      {/* CERTIFICATE ID */}

                      <td className="py-4 px-4 text-sm font-bold text-[#003366]">

                        {certificateNumber}

                      </td>


                      {/* COMPANY */}

                      <td className="py-4 px-4 text-sm font-bold text-[#0F172A]">

                        {company}

                      </td>


                      {/* DATE */}

                      <td className="py-4 px-4 text-sm text-[#64748B] font-medium">

                        {formatDate(issueDate)}

                      </td>


                      {/* STATUS */}

                      <td className="py-4 px-4 text-sm">

                        <span
                          className={`px-2.5 py-1 rounded-[999px] text-xs font-bold ${
                            status.toLowerCase() === "valid"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : status.toLowerCase() === "pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {status}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td className="py-4 px-4 text-sm text-center relative overflow-visible">

                        <button
                          type="button"
                          onClick={() =>
                            toggleActionMenu(
                              certificateId
                            )
                          }
                          className="text-gray-500 hover:text-gray-800 text-lg font-bold px-2 py-1 rounded hover:bg-gray-100 transition-all focus:outline-none"
                        >
                          •••
                        </button>


                        {/* ACTION MENU */}

                        {activeMenuId === certificateId && (

                          <>

                            <div
                              className="fixed inset-0 z-10"
                              onClick={() =>
                                setActiveMenuId(null)
                              }
                            />


                            <div className="absolute right-4 mt-1 w-36 bg-white border border-[#E2E8F0] rounded-[8px] shadow-lg py-1 z-20 text-left font-semibold text-xs">

                              {/* DETAILS */}

                              <Link
                                to={`/certificates/details/${certificateId}`}
                                onClick={() =>
                                  setActiveMenuId(null)
                                }
                                className="block px-4 py-2 text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#003366]"
                              >
                                View Details
                              </Link>


                              {/* EDIT */}

                              <Link
                                to={`/certificates/issue/${certificateId}`}
                                onClick={() =>
                                  setActiveMenuId(null)
                                }
                                className="block px-4 py-2 text-amber-600 hover:bg-[#F8FAFC]"
                              >
                                Edit
                              </Link>


                              {/* DELETE */}

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);

                                  alert(
                                    `Delete/Revoke certificate ${certificateNumber}`
                                  );
                                }}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-[#F8FAFC]"
                              >
                                Revoke / Delete
                              </button>

                            </div>

                          </>

                        )}

                      </td>

                    </tr>

                  );

                })

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AllCertificates;