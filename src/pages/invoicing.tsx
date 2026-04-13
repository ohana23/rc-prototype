import TopNav from "@/components/TopNav";
import Link from "next/link";
import { useRouter } from "next/router";

const invoiceRows = [
  {
    invoiceNumber: "54291-0818-003",
    status: "In Review",
    statusTone: "review",
    company: "Manu Masonry",
    period: "3/1/26 - 3/31/26",
    grossAmount: 300000,
    netAmount: 300000,
    paidAmount: 0,
    href: "/invoice-54291-0818-003",
  },
  {
    invoiceNumber: "",
    status: "No Invoice Contacts",
    statusTone: "muted",
    company: "ABC Painting Co.",
    period: "4/1/26 - 4/20/26",
    grossAmount: 0,
    netAmount: 0,
    paidAmount: 0,
  },
  {
    invoiceNumber: "",
    status: "No Invoice Contacts",
    statusTone: "muted",
    company: "Andrew's Test Company",
    period: "4/1/26 - 4/20/26",
    grossAmount: 0,
    netAmount: 0,
    paidAmount: 0,
  },
  {
    invoiceNumber: "",
    status: "No Invoice Contacts",
    statusTone: "muted",
    company: "AB Industries 22",
    period: "4/1/26 - 4/20/26",
    grossAmount: 0,
    netAmount: 0,
    paidAmount: 0,
  },
  {
    invoiceNumber: "",
    status: "No Invoice Contacts",
    statusTone: "muted",
    company: "0000",
    period: "4/1/26 - 4/20/26",
    grossAmount: 0,
    netAmount: 0,
    paidAmount: 0,
  },
  {
    invoiceNumber: "",
    status: "No Invoice Contacts",
    statusTone: "muted",
    company: "400 test 1",
    period: "4/1/26 - 4/20/26",
    grossAmount: 0,
    netAmount: 0,
    paidAmount: 0,
  },
  {
    invoiceNumber: "",
    status: "No Invoice Contacts",
    statusTone: "muted",
    company: "Auto boingy",
    period: "4/1/26 - 4/20/26",
    grossAmount: 0,
    netAmount: 0,
    paidAmount: 0,
  },
];

const statusCards = [
  { label: "NOT INVITED", count: 264, tone: "neutral" },
  { label: "INVITED", count: 0, tone: "info" },
  { label: "UNDER REVIEW", count: 0, tone: "warning" },
  { label: "APPROVED", count: 0, tone: "success" },
  { label: "REVISE AND RESUBMIT", count: 0, tone: "danger" },
] as const;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export default function InvoicingPage() {
  const router = useRouter();
  const grossTotal = invoiceRows.reduce((sum, row) => sum + row.grossAmount, 0);
  const netTotal = invoiceRows.reduce((sum, row) => sum + row.netAmount, 0);
  const paidTotal = invoiceRows.reduce((sum, row) => sum + row.paidAmount, 0);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <>
      <TopNav />
      <main className="invoicing-page">
        <header className="invoicing-header">
          <div className="invoicing-header__title-row">
            <div className="invoicing-header__title-wrap">
              <button type="button" className="immersive-viewer__back-link" onClick={handleBack}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.15686 12.8441L13.0018 16.824L11.7965 18L6 12L11.7965 6L13.0018 7.17598L9.15686 11.1559L18 11.1559V12.8441L9.15686 12.8441Z"
                    fill="#232729"
                  />
                </svg>
                <span>Back</span>
              </button>
              <button className="invoicing-header__title-icon-button" type="button" aria-label="Settings">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false">
                  <path
                    d="M18.9288 9.14707L18.9302 9.16938C18.7999 8.86371 18.6646 8.54939 18.4947 8.25505C18.3248 7.96072 18.139 7.69869 17.9395 7.43301L17.9581 7.44532L19.1105 4.56368L14.8987 2.125L12.9944 4.56364L13.0081 4.5673C12.3582 4.48092 11.6949 4.47148 11.0284 4.55628L11.0371 4.55128L9.10993 2.13218L4.89506 4.56624L6.04828 7.44381L6.05693 7.43881C5.65025 7.97377 5.32682 8.553 5.07665 9.15917L5.08031 9.14551L2.0031 9.5721L2 14.4448L5.07116 14.8874L5.06982 14.8651C5.2001 15.1708 5.33403 15.4628 5.50392 15.7571C5.67382 16.0515 5.86967 16.3308 6.07784 16.5915L6.05919 16.5792L5.06617 19.0572L4.91048 19.4472L9.11226 21.8685L11.0302 19.4335L10.9929 19.4089C11.6565 19.499 12.3197 19.5084 12.9949 19.4186L12.9689 19.4336L14.8974 21.875L19.095 19.4509C19.095 19.4509 19.031 19.2801 18.937 19.0574L17.9417 16.5734L17.9331 16.5784C18.3398 16.0434 18.6718 15.4592 18.9257 14.8394L18.9284 14.884L21.9956 14.4401L22 9.58967C22 9.58967 21.8189 9.55576 21.5845 9.52952L18.9288 9.14707ZM13.7439 15.0385C12.0735 16.0031 9.93022 15.4287 8.96583 13.7579C8.00144 12.0871 8.57574 9.94331 10.2461 8.97868C11.9165 8.01406 14.0598 8.58849 15.0242 10.2593C15.9886 11.93 15.4143 14.0739 13.7439 15.0385Z"
                    fill="#232729"
                  />
                </svg>
              </button>
              <h1 className="invoicing-header__title">Invoicing</h1>
            </div>
            <div className="invoicing-header__actions">
              <button className="invoicing-btn invoicing-btn--brand">Create Billing Period</button>
              <button className="invoicing-btn invoicing-btn--secondary">Export</button>
            </div>
          </div>
          <nav className="invoicing-header__tabs" aria-label="Invoicing sections">
            <button className="invoicing-header__tab">Owner</button>
            <button className="invoicing-header__tab invoicing-header__tab--active">Subcontractor</button>
            <button className="invoicing-header__tab">Billing Periods</button>
          </nav>
        </header>

        <section className="invoicing-status-cards" aria-label="Invoice status summary">
          {statusCards.map((card) => (
            <article className="invoicing-status-card" key={card.label}>
              <p className="invoicing-status-card__amount">$0.00</p>
              <div className="invoicing-status-card__meta">
                <span className={`invoicing-pill invoicing-pill--${card.tone}`}>{card.label}</span>
                <span className="invoicing-status-card__count">({card.count})</span>
              </div>
            </article>
          ))}
        </section>

        <section className="invoicing-grid" aria-label="Invoicing table">
          <div className="invoicing-grid__toolbar">
            <div className="invoicing-grid__toolbar-left">
              <label className="invoicing-search">
                <input type="search" placeholder="Search" />
              </label>
              <button className="invoicing-toolbar-btn">Filters</button>
            </div>

            <div className="invoicing-grid__toolbar-right">
              <button className="invoicing-select-btn">Select a column to group</button>
              <button className="invoicing-toolbar-btn">Configure</button>
            </div>
          </div>

          <div className="invoicing-grid__table-wrap">
            <table className="invoicing-table">
              <thead>
                <tr>
                  <th className="invoicing-table__checkbox-col">
                    <input type="checkbox" aria-label="Select all invoices" />
                  </th>
                  <th>Invoice #</th>
                  <th>Invoice Status</th>
                  <th>Contract Company</th>
                  <th>Billing Period</th>
                  <th>Gross Amount</th>
                  <th>Net Amount</th>
                  <th>Paid Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceRows.map((row) => (
                  <tr key={`${row.company}-${row.period}-${row.invoiceNumber || "no-invoice"}`}>
                    <td>
                      <input type="checkbox" aria-label={`Select invoice row for ${row.company}`} />
                    </td>
                    <td>
                      {row.href ? (
                        <Link className="invoicing-table__invoice-link" href={row.href}>
                          {row.invoiceNumber}
                        </Link>
                      ) : (
                        row.invoiceNumber
                      )}
                    </td>
                    <td>
                      <span className={`invoicing-row-pill invoicing-row-pill--${row.statusTone}`}>{row.status}</span>
                    </td>
                    <td>{row.company}</td>
                    <td>{row.period}</td>
                    <td>{formatCurrency(row.grossAmount)}</td>
                    <td>{formatCurrency(row.netAmount)}</td>
                    <td>{formatCurrency(row.paidAmount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5}>Grand Totals</td>
                  <td>{formatCurrency(grossTotal)}</td>
                  <td>{formatCurrency(netTotal)}</td>
                  <td>{formatCurrency(paidTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
