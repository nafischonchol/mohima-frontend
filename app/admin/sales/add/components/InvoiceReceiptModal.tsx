"use client";

import React, { useRef } from "react";
import { X, Printer, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export type ReceiptItem = {
  id: string;
  name: string;
  banglaName?: string;
  sellPrice: number;
  quantity: number;
  total: number;
};

export type ReceiptData = {
  invoiceId: string;
  date: string;
  customerName: string;
  customerPhone: string;
  items: ReceiptItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  paymentMethod: string;
  paidAmount: number;
  changeAmount: number;
};

interface InvoiceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReceiptData | null;
}

export function InvoiceReceiptModal({
  isOpen,
  onClose,
  data,
}: InvoiceReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    // Elegant printing mechanism using standard print query styling
    const printContent = receiptRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      // Create a temporary style for printing clean receipts
      const style = document.createElement("style");
      style.innerHTML = `
        @media print {
          body {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-receipt-container {
            width: 80mm !important;
            max-width: 80mm !important;
            padding: 10px !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 auto !important;
          }
        }
      `;
      document.head.appendChild(style);
      window.print();
      document.head.removeChild(style);
    }
  };

  const getPaymentLabel = (method: string) => {
    const lower = method.toLowerCase();
    switch (lower) {
      case "cash":
        return "Cash (নগদ)";
      case "card":
        return "Card (কার্ড)";
      case "bkash":
        return "bKash (বিকাশ)";
      case "nagad":
        return "Nagad (নগদ)";
      default:
        return method;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto py-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 no-print"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg mx-4 p-6 shadow-2xl border border-slate-100 z-10 flex flex-col max-h-[90vh] scale-100 transition-all duration-300 animate-in zoom-in-95 duration-200">
        {/* Close Button - No Print */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 p-1.5 rounded-lg hover:bg-slate-50 transition-colors no-print z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header Banner - No Print */}
        <div className="flex flex-col items-center text-center mb-6 no-print">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-3 animate-bounce">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Sale Completed Successfully!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Transaction recorded and invoice generated
          </p>
        </div>

        {/* Scrollable Receipt Area */}
        <div className="flex-1 overflow-y-auto pr-1 py-1 border-y border-slate-100 bg-slate-50/50 p-4 rounded-xl no-print">
          {/* Thermal Receipt Visual Mockup */}
          <div
            ref={receiptRef}
            className="bg-white p-6 shadow-sm border border-slate-200 rounded-lg mx-auto max-w-[340px] font-mono text-xs text-slate-800 print-receipt-container"
          >
            {/* Store details */}
            <div className="text-center space-y-1 pb-4 border-b border-dashed border-slate-300">
              <h3 className="font-bold text-base uppercase text-slate-900 tracking-wide">
                Mohimaa
              </h3>
              <p className="text-[10px] text-slate-500">Dhaka, Bangladesh</p>
              <p className="text-[10px] text-slate-500">
                Tel: +880 1700-000000
              </p>
              <p className="text-[10px] text-slate-500">BIN: 001234567-0101</p>
            </div>

            {/* Invoice meta */}
            <div className="py-3 space-y-1 border-b border-dashed border-slate-300 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>Invoice:</span>
                <span className="font-bold text-slate-900">
                  {data.invoiceId}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{data.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-bold text-slate-900">
                  {data.customerName}
                </span>
              </div>
              {data.customerPhone && (
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span>{data.customerPhone}</span>
                </div>
              )}
            </div>

            {/* Items table */}
            <div className="py-4 border-b border-dashed border-slate-300">
              <div className="flex justify-between font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">
                <span className="w-1/2">Item Description</span>
                <span className="w-1/6 text-center">Qty</span>
                <span className="w-1/3 text-right">Price</span>
              </div>
              <div className="space-y-3">
                {data.items.map((item) => (
                  <div key={item.id} className="space-y-0.5">
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span className="w-1/2 break-words leading-tight">
                        {item.name}
                      </span>
                      <span className="w-1/6 text-center">{item.quantity}</span>
                      <span className="w-1/3 text-right">
                        ৳{item.total.toFixed(2)}
                      </span>
                    </div>
                    {item.banglaName && (
                      <div className="text-[10px] text-slate-500 pl-0.5">
                        {item.banglaName}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-400 pl-0.5">
                      {item.quantity} x ৳{item.sellPrice.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals and calculations */}
            <div className="py-3 space-y-1.5 border-b border-dashed border-slate-300 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>৳{data.subtotal.toFixed(2)}</span>
              </div>
              {data.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>-৳{data.discountAmount.toFixed(2)}</span>
                </div>
              )}
              {data.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>VAT/Tax:</span>
                  <span>৳{data.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1">
                <span>Total Payable:</span>
                <span>৳{data.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payments & Change info */}
            <div className="py-3 space-y-1.5 border-b border-dashed border-slate-300 text-slate-600">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-bold text-slate-900">
                  {getPaymentLabel(data.paymentMethod)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Paid Amount:</span>
                <span className="font-bold text-slate-900">
                  ৳{data.paidAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-slate-900">
                <span>Change Due:</span>
                <span>৳{data.changeAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer message */}
            <div className="text-center pt-5 space-y-3">
              <p className="text-[10px] font-bold text-slate-700 italic">
                Thank You for Shopping!
              </p>

              {/* Receipt Barcode Visualizer */}
              <div className="flex flex-col items-center justify-center gap-1.5">
                <div className="flex items-center justify-center gap-[1px] h-8 w-48 bg-white overflow-hidden py-1">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-black h-full"
                      style={{
                        width: `${i % 3 === 0 ? 1 : i % 5 === 0 ? 3 : 2}px`,
                        opacity: i % 7 === 0 ? 0 : 1,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[9px] text-slate-400 font-mono tracking-widest">
                  *{data.invoiceId}*
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons - No Print */}
        <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-slate-100 mt-6 no-print">
          <Button
            type="button"
            variant="secondary"
            onClick={handlePrint}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 h-9 rounded-xl cursor-pointer"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 h-9 rounded-xl cursor-pointer"
          >
            New Sale
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
