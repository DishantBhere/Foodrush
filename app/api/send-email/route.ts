import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { jsPDF } from "jspdf";

export async function POST(req: Request) {
  try {
    const { customerName, customerEmail, orderId, items, total } = await req.json();

    // ─── Generate PDF Receipt ───────────────────────────────────────────
    const doc = new jsPDF();

    // Header
    doc.setFillColor(220, 38, 38); // red
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("FOODRUSH.IO", 14, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Smart Canteen Food Ordering", 14, 25);

    // Receipt title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER RECEIPT", 14, 45);

    // Order info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID   : #${orderId}`, 14, 55);
    doc.text(`Customer   : ${customerName}`, 14, 62);
    doc.text(`Email      : ${customerEmail}`, 14, 69);
    doc.text(`Date       : ${new Date().toLocaleDateString("en-IN")}`, 14, 76);
    doc.text(`Time       : ${new Date().toLocaleTimeString("en-IN")}`, 14, 83);

    // Divider
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.5);
    doc.line(14, 88, 196, 88);

    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 91, 182, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Item", 16, 97);
    doc.text("Qty", 120, 97);
    doc.text("Price", 145, 97);
    doc.text("Total", 172, 97);

    // Table Rows
    doc.setFont("helvetica", "normal");
    let y = 107;
    items.forEach((item: any) => {
      const itemTotal = (item.price * item.quantity).toFixed(2);
      doc.text(item.name.substring(0, 30), 16, y);
      doc.text(String(item.quantity), 120, y);
      doc.text(`Rs.${item.price}`, 143, y);
      doc.text(`Rs.${itemTotal}`, 170, y);
      y += 10;

      // light row divider
      doc.setDrawColor(220, 220, 220);
      doc.line(14, y - 4, 196, y - 4);
    });

    // Total Section
    doc.setDrawColor(220, 38, 38);
    doc.line(14, y, 196, y);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL AMOUNT:", 120, y);
    doc.text(`Rs.${total}`, 170, y);

    // Footer
    y += 20;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text("Thank you for ordering from FoodRush.io!", 14, y);
    doc.text("This is a computer generated receipt.", 14, y + 6);

    // Convert PDF to base64
    const pdfBase64 = doc.output("datauristring").split(",")[1];

    // ─── Send Email with PDF Attached ──────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsList = items
      .map(
        (item: any) =>
          `<tr>
            <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${(item.price * item.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join("");

    await transporter.sendMail({
      from: `"FoodRush.io" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Order Confirmed! #${orderId} — FoodRush.io`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto">
          <div style="background:#dc2626;padding:20px;text-align:center">
            <h1 style="color:white;margin:0">FoodRush.io</h1>
            <p style="color:white;margin:5px 0 0">Smart Canteen Food Ordering</p>
          </div>
          <div style="padding:20px">
            <h2>Thank you, ${customerName}! 🎉</h2>
            <p>Your order <strong>#${orderId}</strong> has been placed successfully.</p>
            <p>Your PDF receipt is attached to this email.</p>
            <table style="width:100%;border-collapse:collapse;margin-top:16px">
              <thead>
                <tr style="background:#f5f5f5">
                  <th style="padding:8px;text-align:left">Item</th>
                  <th style="padding:8px;text-align:center">Qty</th>
                  <th style="padding:8px;text-align:right">Amount</th>
                </tr>
              </thead>
              <tbody>${itemsList}</tbody>
            </table>
            <div style="text-align:right;margin-top:12px;font-size:18px;font-weight:bold">
              Total: ₹${total}
            </div>
            <p style="margin-top:20px;color:#666;font-size:13px">
              You can track your order on FoodRush.io using your phone number.
            </p>
          </div>
          <div style="background:#f5f5f5;padding:12px;text-align:center;font-size:12px;color:#999">
            © 2025 FoodRush.io — All rights reserved
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `FoodRush-Receipt-${orderId}.pdf`,
          content: pdfBase64,
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}