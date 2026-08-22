"use client";

import { Printer } from "lucide-react";
import type { CustomerOrderDetail } from "@/lib/api/customerOrder";

interface PrintButtonProps {
  order?: CustomerOrderDetail | null;
}

export function PrintButton({ order }: PrintButtonProps) {
  const handlePrint = () => {
    if (!order) {
      window.print();
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }

    const itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0;">
          <div style="font-weight: 700; color: #0f172a;">${item.name}</div>
          ${item.variant_title ? `<div style="font-size: 12px; color: #e11d48; margin-top: 2px;">Variant: ${item.variant_title}</div>` : ""}
          ${item.sku ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">SKU: ${item.sku}</div>` : ""}
        </td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">৳${item.unit_price.toLocaleString()}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #0f172a;">৳${item.total.toLocaleString()}</td>
      </tr>
    `
      )
      .join("");

    const shippingInfoHtml = order.client_snapshot
      ? `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 14px;">
        <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 8px;">Shipping Information</div>
        ${order.client_snapshot.company_name ? `<div style="font-weight: 700; color: #0f172a; font-size: 15px;">${order.client_snapshot.company_name}</div>` : ""}
        ${order.client_snapshot.name ? `<div style="color: #334155;">Customer: ${order.client_snapshot.name}</div>` : ""}
        ${order.client_snapshot.address ? `<div style="color: #334155;">Address: ${order.client_snapshot.address}</div>` : ""}
        ${order.client_snapshot.city ? `<div style="color: #334155;">City: ${order.client_snapshot.city}</div>` : ""}
        ${order.client_snapshot.phone ? `<div style="color: #334155; margin-top: 4px;">Phone: <strong>${order.client_snapshot.phone}</strong></div>` : ""}
      </div>
    `
      : "";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${order.invoice_no || order.id}</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              color: #1e293b;
              padding: 24px;
              margin: 0;
              background: #ffffff;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #0f172a;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .brand-name {
              font-size: 26px;
              font-weight: 900;
              color: #0f172a;
              margin: 0;
              letter-spacing: -0.02em;
            }
            .brand-sub {
              font-size: 13px;
              color: #64748b;
              margin-top: 4px;
            }
            .invoice-details {
              text-align: right;
              font-size: 14px;
            }
            .badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              background: #f1f5f9;
              color: #334155;
              margin-bottom: 8px;
              border: 1px solid #cbd5e1;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 16px;
              font-size: 14px;
            }
            th {
              background: #f1f5f9;
              padding: 12px 10px;
              text-align: left;
              border-bottom: 2px solid #cbd5e1;
              font-weight: 700;
              color: #334155;
            }
            .totals {
              margin-top: 24px;
              width: 320px;
              margin-left: auto;
              font-size: 14px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 16px;
            }
            .totals div {
              display: flex;
              justify-content: space-between;
              padding: 6px 0;
              color: #475569;
            }
            .grand-total {
              border-top: 2px solid #e2e8f0;
              font-size: 18px;
              font-weight: 900;
              color: #e11d48;
              padding-top: 10px !important;
              margin-top: 6px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="brand-name">INVOICE</h1>
              <div class="brand-sub">Mohimaa B2B Store</div>
            </div>
            <div class="invoice-details">
              <div class="badge">${order.status}</div>
              <div><strong>Invoice No:</strong> ${order.invoice_no || `#ORD-${order.id}`}</div>
              <div><strong>Date:</strong> ${order.date}</div>
            </div>
          </div>

          ${shippingInfoHtml}

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: center; width: 100px;">Price</th>
                <th style="text-align: center; width: 80px;">Qty</th>
                <th style="text-align: right; width: 120px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div><span>Subtotal:</span> <span style="font-weight: 600; color: #0f172a;">৳${order.total_amount.toLocaleString()}</span></div>
            ${order.discount_amount > 0 ? `<div><span>Discount:</span> <span style="color: #059669;">-৳${order.discount_amount.toLocaleString()}</span></div>` : ""}
            ${order.tax_amount > 0 ? `<div><span>Tax:</span> <span>৳${order.tax_amount.toLocaleString()}</span></div>` : ""}
            <div class="grand-total"><span>Grand Total:</span> <span>৳${order.grand_total.toLocaleString()}</span></div>
          </div>

          <div class="footer">
            Thank you for shopping with Mohimaa!
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <button
      onClick={handlePrint}
      className="ml-auto bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 text-sm border border-slate-700 shadow-sm print:hidden cursor-pointer"
    >
      <Printer size={16} />
      Print Invoice
    </button>
  );
}
