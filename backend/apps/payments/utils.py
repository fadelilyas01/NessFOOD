import io
import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from django.conf import settings

def generate_invoice_pdf(order):
    """
    Generate a PDF invoice for the given order using ReportLab.
    Returns the binary content of the PDF.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'InvoiceTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.HexColor('#05a155'), # Ness Food Green
        alignment=1 # Center
    )
    
    normal_style = styles['Normal']
    bold_style = ParagraphStyle('BoldNormal', parent=normal_style, fontName='Helvetica-Bold')
    
    # Header
    elements.append(Paragraph("FACTURE", title_style))
    
    # Order Details & Company Info Table
    header_data = [
        [
            Paragraph("<b>Information Client</b>", bold_style),
            Paragraph("<b>Notre Société</b>", bold_style)
        ],
        [
            Paragraph(f"{order.shipping_name}<br/>{order.shipping_address}<br/>{order.shipping_postal_code} {order.shipping_city}<br/>{order.shipping_country}<br/><br/>Email: {order.shipping_email}<br/>Tél: {order.shipping_phone}", normal_style),
            Paragraph(f"NESS FOOD<br/>123 Rue de la Gastronomie<br/>75000 Paris<br/>France<br/><br/>Siret: 1234567890<br/>Email: contact@nessfood.com", normal_style)
        ],
        [
            Paragraph(f"<br/><b>Facture N°:</b> {order.order_number}<br/><b>Date:</b> {order.created_at.strftime('%d/%m/%Y')}", normal_style),
            ""
        ]
    ]
    
    header_table = Table(header_data, colWidths=['50%', '50%'])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    
    elements.append(header_table)
    elements.append(Spacer(1, 30))
    
    # Items Table
    data = [
        ['Désignation', 'Prix Unitaire', 'Qté', 'Total']
    ]
    
    for item in order.items.all():
        data.append([
            item.product_name,
            f"{item.product_price} $CAD",
            str(item.quantity),
            f"{item.subtotal} $CAD"
        ])
    
    # Summary Rows
    data.append(['', '', 'Sous-total', f"{order.subtotal} $CAD"])
    
    if order.discount_amount > 0:
        data.append(['', '', f'Remise ({order.coupon.code if order.coupon else ""})', f"-{order.discount_amount} $CAD"])
        
    data.append(['', '', 'Livraison', f"{order.shipping_cost} $CAD"])
    data.append(['', '', 'TOTAL', f"{order.total} $CAD"])
    
    # Table Styling
    num_items = order.items.count()
    total_offset = 3 if order.discount_amount > 0 else 2
    summary_start_idx = num_items + 1
    
    t_style = [
        # Header
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f0f0f0')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.black),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('ALIGN', (0,1), (0,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,0), 12),
        ('GRID', (0,0), (-1,-total_offset-1), 1, colors.HexColor('#dddddd')),
    ]
    
    # Summary rows styling
    for i in range(summary_start_idx, len(data)):
        t_style.extend([
            ('FONTNAME', (2, i), (-1, i), 'Helvetica-Bold'),
            ('ALIGN', (2, i), (-1, i), 'RIGHT'),
            ('LINEABOVE', (2, i), (-1, i), 1, colors.HexColor('#dddddd')),
        ])
        
    # Final Total row
    t_style.extend([
        ('BACKGROUND', (2, -1), (-1, -1), colors.HexColor('#05a155')),
        ('TEXTCOLOR', (2, -1), (-1, -1), colors.white),
    ])
    
    table = Table(data, colWidths=['40%', '20%', '15%', '25%'])
    table.setStyle(TableStyle(t_style))
    
    elements.append(table)
    elements.append(Spacer(1, 40))
    
    # Footer Notice
    elements.append(Paragraph("Merci de votre confiance. Pour toute question, veuillez nous contacter.", styles['Italic']))
    
    doc.build(elements)
    
    pdf = buffer.getvalue()
    buffer.close()
    
    return pdf
