import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Colors
    C_ORANGE = RGBColor(249, 115, 22)      # #F97316
    C_DARK = RGBColor(30, 41, 59)          # #1E293B
    C_SLATE = RGBColor(71, 85, 105)        # #475569
    C_LIGHT_BG = RGBColor(248, 250, 252)   # #F8FAFC
    C_BLUE_BG = RGBColor(238, 242, 255)    # #EEF2FF
    C_CYAN = RGBColor(14, 165, 233)        # #0EA5E9
    C_GREEN = RGBColor(34, 197, 94)        # #22C55E
    C_CARD_BORDER = RGBColor(203, 213, 225)# #CBD5E1

    # --- SLIDE 1: Title ---
    s1 = prs.slides.add_slide(blank_layout)
    # Header badge
    tb1_badge = s1.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.3), Inches(0.5))
    tf1_badge = tb1_badge.text_frame
    p = tf1_badge.paragraphs[0]
    p.text = "TDTU • KHOA CÔNG NGHỆ THÔNG TIN • BÁO CÁO SEMINAR SOA"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    # Title
    tb1_title = s1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(2.5))
    tf1_title = tb1_title.text_frame
    tf1_title.word_wrap = True
    p1 = tf1_title.paragraphs[0]
    p1.text = "Firebase Auth\nwith Microservices\n& Stateless JWT"
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = C_DARK

    # Subtitle & Authors
    tb1_sub = s1.shapes.add_textbox(Inches(1.0), Inches(5.2), Inches(11.3), Inches(1.5))
    tf1_sub = tb1_sub.text_frame
    p_sub = tf1_sub.paragraphs[0]
    p_sub.text = "Triển khai Identity Provider và Xác thực Token Đa Nền tảng (Spring Boot • FastAPI • NodeJS)"
    p_sub.font.size = Pt(16)
    p_sub.font.color.rgb = C_SLATE

    p_team = tf1_sub.add_paragraph()
    p_team.text = "Nhóm thuyết trình Seminar"
    p_team.font.size = Pt(16)
    p_team.font.bold = True
    p_team.font.color.rgb = C_ORANGE
    p_team.space_before = Pt(14)

    # --- SLIDE 2: Pain Point ---
    s2 = prs.slides.add_slide(blank_layout)
    # Circle icon
    circle2 = s2.shapes.add_shape(MSO_SHAPE.OVAL, Inches(6.166), Inches(1.0), Inches(1.0), Inches(1.0))
    circle2.fill.solid()
    circle2.fill.fore_color.rgb = C_ORANGE
    circle2.line.color.rgb = C_ORANGE
    tf_c2 = circle2.text_frame
    p_c2 = tf_c2.paragraphs[0]
    p_c2.text = "🔒"
    p_c2.font.size = Pt(28)
    p_c2.alignment = PP_ALIGN.CENTER

    tb2_title = s2.shapes.add_textbox(Inches(1.5), Inches(2.3), Inches(10.333), Inches(1.0))
    tf2_title = tb2_title.text_frame
    p2 = tf2_title.paragraphs[0]
    p2.text = "Khâu xác thực Microservices thô sơ?"
    p2.font.size = Pt(36)
    p2.font.bold = True
    p2.font.color.rgb = C_DARK
    p2.alignment = PP_ALIGN.CENTER

    tb2_desc = s2.shapes.add_textbox(Inches(2.2), Inches(3.5), Inches(8.933), Inches(3.2))
    tf2_desc = tb2_desc.text_frame
    tf2_desc.word_wrap = True
    p2_1 = tf2_desc.paragraphs[0]
    p2_1.text = "Kiểm thử và xác thực thủ công là một ý tưởng tệ hại khi hệ thống có hàng chục microservices. Việc quản lý session lưu trên RAM từng server hay tự băm mật khẩu trong database ngốn rất nhiều thời gian và tiềm ẩn lỗ hổng bảo mật nghiêm trọng."
    p2_1.font.size = Pt(18)
    p2_1.font.color.rgb = C_SLATE
    p2_1.alignment = PP_ALIGN.CENTER
    p2_1.space_after = Pt(20)

    p2_2 = tf2_desc.add_paragraph()
    p2_2.text = "Chưa kể việc thiếu tính tự động hóa và chuẩn Stateless Token cũng gây khó dễ cho việc mở rộng hệ thống (scale ngang) và kết nối an toàn đa nền tảng (Web, Mobile, External Services)."
    p2_2.font.size = Pt(18)
    p2_2.font.color.rgb = C_SLATE
    p2_2.alignment = PP_ALIGN.CENTER

    # --- SLIDE 3: Solution ---
    s3 = prs.slides.add_slide(blank_layout)
    # Big oval/rounded container
    bg3 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.666), Inches(1.0), Inches(8.0), Inches(5.5))
    bg3.fill.solid()
    bg3.fill.fore_color.rgb = C_BLUE_BG
    bg3.line.color.rgb = C_CARD_BORDER

    # Center circle
    circle3 = s3.shapes.add_shape(MSO_SHAPE.OVAL, Inches(6.166), Inches(1.6), Inches(1.0), Inches(1.0))
    circle3.fill.solid()
    circle3.fill.fore_color.rgb = C_ORANGE
    circle3.line.color.rgb = C_ORANGE
    tf_c3 = circle3.text_frame
    p_c3 = tf_c3.paragraphs[0]
    p_c3.text = "⚡"
    p_c3.font.size = Pt(28)
    p_c3.alignment = PP_ALIGN.CENTER

    tb3 = s3.shapes.add_textbox(Inches(3.0), Inches(2.9), Inches(7.333), Inches(3.2))
    tf3 = tb3.text_frame
    p3_head = tf3.paragraphs[0]
    p3_head.text = "Giải pháp"
    p3_head.font.size = Pt(40)
    p3_head.font.bold = True
    p3_head.font.color.rgb = C_DARK
    p3_head.alignment = PP_ALIGN.CENTER
    p3_head.space_after = Pt(20)

    p3_1 = tf3.add_paragraph()
    p3_1.text = "IDENTITY-AS-A-SERVICE (IDaaS)"
    p3_1.font.size = Pt(20)
    p3_1.font.bold = True
    p3_1.font.color.rgb = C_ORANGE
    p3_1.alignment = PP_ALIGN.CENTER
    p3_1.space_after = Pt(10)

    p3_2 = tf3.add_paragraph()
    p3_2.text = "Firebase Authentication • Google Cloud"
    p3_2.font.size = Pt(18)
    p3_2.font.color.rgb = C_DARK
    p3_2.alignment = PP_ALIGN.CENTER
    p3_2.space_after = Pt(8)

    p3_3 = tf3.add_paragraph()
    p3_3.text = "Stateless RS256 JWT Token"
    p3_3.font.size = Pt(17)
    p3_3.font.color.rgb = C_SLATE
    p3_3.alignment = PP_ALIGN.CENTER

    # --- SLIDE 4: Identity Provider & Client SDK ---
    s4 = prs.slides.add_slide(blank_layout)
    tb4_title = s4.shapes.add_textbox(Inches(1.0), Inches(0.6), Inches(11.3), Inches(0.8))
    tf4_title = tb4_title.text_frame
    p4 = tf4_title.paragraphs[0]
    p4.text = "IDENTITY PROVIDER & CLIENT SDK"
    p4.font.size = Pt(32)
    p4.font.bold = True
    p4.font.color.rgb = C_ORANGE

    tb4_def = s4.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.3), Inches(1.2))
    tf4_def = tb4_def.text_frame
    tf4_def.word_wrap = True
    p4_d = tf4_def.paragraphs[0]
    p4_d.text = "- Là mô hình tách biệt hoàn toàn việc quản lý danh tính người dùng (Identity) ra khỏi logic nghiệp vụ (Business Logic) của các dịch vụ trong kiến trúc hướng dịch vụ SOA."
    p4_d.font.size = Pt(16)
    p4_d.font.color.rgb = C_DARK

    p4_v = tf4_def.add_paragraph()
    p4_v.text = "Vai trò cốt lõi:\n• Ủy quyền bảo mật cho Google Cloud (Mật khẩu, chống brute-force, OAuth Google/Email).\n• Cấp phát vé số định danh duy nhất (Firebase ID Token) dùng chung cho toàn bộ hệ thống."
    p4_v.font.size = Pt(15)
    p4_v.font.color.rgb = C_SLATE
    p4_v.space_before = Pt(8)

    # 3 step cards on bottom
    steps = [
        ("01 Đăng nhập", "Giao diện React Client", "User nhập email/pass hoặc chọn Google OAuth", C_CYAN),
        ("02 Google Auth", "Google Identity Platform", "Google kiểm tra danh tính và ký số RS256", C_ORANGE),
        ("03 Nhận ID Token", "Stateless JWT Token", "Client lưu token RAM sống 1h gửi kèm request", C_GREEN)
    ]
    for idx, (stitle, ssub, sdesc, col) in enumerate(steps):
        left_pos = Inches(1.0 + idx * 3.9)
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_pos, Inches(4.2), Inches(3.5), Inches(2.4))
        card.fill.solid()
        card.fill.fore_color.rgb = C_LIGHT_BG
        card.line.color.rgb = col
        card.line.width = Pt(2)
        tf_card = card.text_frame
        tf_card.word_wrap = True
        
        pc1 = tf_card.paragraphs[0]
        pc1.text = stitle
        pc1.font.size = Pt(18)
        pc1.font.bold = True
        pc1.font.color.rgb = col
        pc1.space_after = Pt(4)

        pc2 = tf_card.add_paragraph()
        pc2.text = ssub
        pc2.font.size = Pt(14)
        pc2.font.bold = True
        pc2.font.color.rgb = C_DARK
        pc2.space_after = Pt(8)

        pc3 = tf_card.add_paragraph()
        pc3.text = sdesc
        pc3.font.size = Pt(13)
        pc3.font.color.rgb = C_SLATE

    # --- SLIDE 5: Stateless JWT & Credentials ---
    s5 = prs.slides.add_slide(blank_layout)
    tb5_title = s5.shapes.add_textbox(Inches(1.0), Inches(0.6), Inches(11.3), Inches(0.8))
    tf5_title = tb5_title.text_frame
    p5 = tf5_title.paragraphs[0]
    p5.text = "STATELESS JWT & CREDENTIALS"
    p5.font.size = Pt(32)
    p5.font.bold = True
    p5.font.color.rgb = C_ORANGE

    tb5_def = s5.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.3), Inches(1.0))
    tf5_def = tb5_def.text_frame
    tf5_def.word_wrap = True
    p5_d = tf5_def.paragraphs[0]
    p5_d.text = "- Token JWT chứa sẵn thông tin định danh (User ID, Email, Expiry) được ký số bảo mật, giúp Microservices xác thực ngay lập tức mà không cần truy vấn Session Database.\nNguyên lý ở đây là tách biệt cấu hình công khai (Client) ra khỏi khóa bí mật quản trị (Server)."
    p5_d.font.size = Pt(16)
    p5_d.font.color.rgb = C_DARK

    # 2 Big Cards: Client vs Server
    # Client Card
    c_left = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(3.0), Inches(5.4), Inches(3.8))
    c_left.fill.solid()
    c_left.fill.fore_color.rgb = C_LIGHT_BG
    c_left.line.color.rgb = C_CYAN
    c_left.line.width = Pt(2)
    tf_cl = c_left.text_frame
    tf_cl.word_wrap = True
    pcl1 = tf_cl.paragraphs[0]
    pcl1.text = "💻 Frontend Configuration (.env)"
    pcl1.font.size = Pt(18)
    pcl1.font.bold = True
    pcl1.font.color.rgb = C_CYAN
    pcl1.space_after = Pt(12)

    pcl2 = tf_cl.add_paragraph()
    pcl2.text = "• apiKey, authDomain, projectId, appId\n• Dùng để khởi tạo Firebase Client SDK trên Web React\n• ĐẶC TÍNH: Là Public Key an toàn, được phép nhúng trên trình duyệt người dùng."
    pcl2.font.size = Pt(15)
    pcl2.font.color.rgb = C_SLATE
    pcl2.line_spacing = 1.3

    # Server Card
    c_right = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.9), Inches(3.0), Inches(5.4), Inches(3.8))
    c_right.fill.solid()
    c_right.fill.fore_color.rgb = C_LIGHT_BG
    c_right.line.color.rgb = C_ORANGE
    c_right.line.width = Pt(2)
    tf_cr = c_right.text_frame
    tf_cr.word_wrap = True
    pcr1 = tf_cr.paragraphs[0]
    pcr1.text = "🔑 Backend Private Key (serviceAccountKey.json)"
    pcr1.font.size = Pt(18)
    pcr1.font.bold = True
    pcr1.font.color.rgb = C_ORANGE
    pcr1.space_after = Pt(12)

    pcr2 = tf_cr.add_paragraph()
    pcr2.text = "• private_key, client_email, project_id\n• Cấp quyền Admin tối cao cho Spring Boot, FastAPI, NodeJS\n• BẢO MẬT: BẮT BUỘC giấu kín, thêm vào .gitignore, TUYỆT ĐỐI KHÔNG commit lên GitHub!"
    pcr2.font.size = Pt(15)
    pcr2.font.color.rgb = C_SLATE
    pcr2.line_spacing = 1.3

    # --- SLIDE 6: Local JWT Verification ---
    s6 = prs.slides.add_slide(blank_layout)
    tb6_title = s6.shapes.add_textbox(Inches(1.0), Inches(0.6), Inches(11.3), Inches(0.8))
    tf6_title = tb6_title.text_frame
    p6 = tf6_title.paragraphs[0]
    p6.text = "LOCAL JWT VERIFICATION (RS256)"
    p6.font.size = Pt(32)
    p6.font.bold = True
    p6.font.color.rgb = C_ORANGE

    # Left text
    tb6_left = s6.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.3), Inches(5.0))
    tf6_left = tb6_left.text_frame
    tf6_left.word_wrap = True
    p6_l1 = tf6_left.paragraphs[0]
    p6_l1.text = "Cơ chế xác thực cục bộ không gọi mạng (Zero Network Latency):"
    p6_l1.font.size = Pt(17)
    p6_l1.font.bold = True
    p6_l1.font.color.rgb = C_DARK
    p6_l1.space_after = Pt(10)

    p6_l2 = tf6_left.add_paragraph()
    p6_l2.text = "• Google ký Token bằng Private Key bí mật (RS256).\n\n• Google công khai chùm Public Keys (JWKS) trên Internet.\n\n• Backend Admin SDK tự động tải và cache Public Keys trong RAM.\n\n• Khi có request đến, Backend giải mã toán học RSA ngay trong RAM trong < 1ms, hoàn toàn Offline, không phụ thuộc mạng."
    p6_l2.font.size = Pt(15)
    p6_l2.font.color.rgb = C_SLATE
    p6_l2.line_spacing = 1.2

    # Right Code Window Mockup
    code_bg = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.6), Inches(1.8), Inches(5.7), Inches(4.8))
    code_bg.fill.solid()
    code_bg.fill.fore_color.rgb = RGBColor(15, 23, 42) # Slate-900
    code_bg.line.color.rgb = RGBColor(51, 65, 85)

    # 3 colored window dots
    dot_r = s6.shapes.add_shape(MSO_SHAPE.OVAL, Inches(6.8), Inches(2.0), Inches(0.18), Inches(0.18))
    dot_r.fill.solid()
    dot_r.fill.fore_color.rgb = RGBColor(239, 68, 68)
    dot_r.line.fill.background()

    dot_y = s6.shapes.add_shape(MSO_SHAPE.OVAL, Inches(7.05), Inches(2.0), Inches(0.18), Inches(0.18))
    dot_y.fill.solid()
    dot_y.fill.fore_color.rgb = RGBColor(234, 179, 8)
    dot_y.line.fill.background()

    dot_g = s6.shapes.add_shape(MSO_SHAPE.OVAL, Inches(7.3), Inches(2.0), Inches(0.18), Inches(0.18))
    dot_g.fill.solid()
    dot_g.fill.fore_color.rgb = RGBColor(34, 197, 94)
    dot_g.line.fill.background()

    tb6_code = s6.shapes.add_textbox(Inches(6.8), Inches(2.3), Inches(5.3), Inches(4.0))
    tf6_code = tb6_code.text_frame
    tf6_code.word_wrap = True
    code_text = (
        "// 1. Trích xuất Bearer Token từ Header\n"
        "String token = request.getHeader(\"Authorization\")\n"
        "                      .replace(\"Bearer \", \"\");\n\n"
        "// 2. Verify chữ ký RSA qua Google Public Keys\n"
        "FirebaseToken decoded = FirebaseAuth.getInstance()\n"
        "                                   .verifyIdToken(token);\n\n"
        "// 3. Tiêm định danh vào Spring Security\n"
        "SecurityContextHolder.getContext()\n"
        "  .setAuthentication(new AuthToken(decoded));"
    )
    p_code = tf6_code.paragraphs[0]
    p_code.text = code_text
    p_code.font.size = Pt(13)
    p_code.font.name = "Consolas"
    p_code.font.color.rgb = RGBColor(56, 189, 248) # Cyan light

    # --- SLIDE 7: Polyglot Integration Flowchart ---
    s7 = prs.slides.add_slide(blank_layout)
    tb7_title = s7.shapes.add_textbox(Inches(1.0), Inches(0.6), Inches(11.3), Inches(0.8))
    tf7_title = tb7_title.text_frame
    p7 = tf7_title.paragraphs[0]
    p7.text = "POLYGLOT MICROSERVICES INTEGRATION"
    p7.font.size = Pt(32)
    p7.font.bold = True
    p7.font.color.rgb = C_ORANGE

    tb7_def = s7.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.3), Inches(1.2))
    tf7_def = tb7_def.text_frame
    tf7_def.word_wrap = True
    p7_d = tf7_def.paragraphs[0]
    p7_d.text = "- Tính trung lập công nghệ (Technology Agnostic) của SOA: Cùng một ID Token do Firebase cấp, được tích hợp bảo vệ đồng thời cho cả 3 Backend: Java Spring Boot, Python FastAPI và NodeJS Express.\n- Filter đóng vai trò là cửa ngõ kiểm soát an ninh trước khi request chạm tới Business Controller."
    p7_d.font.size = Pt(16)
    p7_d.font.color.rgb = C_DARK

    # Simple Flowchart on Bottom
    f_steps = [
        ("Client Request", "Gửi HTTP kèm\nBearer Token", C_CYAN, Inches(1.0)),
        ("Security Filter", "Bóc tách Header\n& Verify RS256", C_ORANGE, Inches(4.0)),
        ("Token Hợp Lệ?", "Kiểm tra chữ ký\n& hạn dùng exp", C_DARK, Inches(7.0)),
    ]
    for title, desc, col, lpos in f_steps:
        box = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, lpos, Inches(3.8), Inches(2.6), Inches(2.2))
        box.fill.solid()
        box.fill.fore_color.rgb = C_LIGHT_BG
        box.line.color.rgb = col
        box.line.width = Pt(2)
        tf_b = box.text_frame
        p_b1 = tf_b.paragraphs[0]
        p_b1.text = title
        p_b1.font.size = Pt(16)
        p_b1.font.bold = True
        p_b1.font.color.rgb = col
        p_b1.alignment = PP_ALIGN.CENTER
        p_b2 = tf_b.add_paragraph()
        p_b2.text = desc
        p_b2.font.size = Pt(13)
        p_b2.font.color.rgb = C_SLATE
        p_b2.alignment = PP_ALIGN.CENTER
        p_b2.space_before = Pt(8)

    # 2 Decision Outcomes
    box_yes = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.0), Inches(3.2), Inches(2.3), Inches(1.3))
    box_yes.fill.solid()
    box_yes.fill.fore_color.rgb = RGBColor(220, 252, 231)
    box_yes.line.color.rgb = C_GREEN
    tf_y = box_yes.text_frame
    py = tf_y.paragraphs[0]
    py.text = "✅ Hợp Lệ: 200 OK\n(Cho phép truy cập)"
    py.font.size = Pt(13)
    py.font.bold = True
    py.font.color.rgb = RGBColor(21, 128, 61)
    py.alignment = PP_ALIGN.CENTER

    box_no = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.0), Inches(4.8), Inches(2.3), Inches(1.3))
    box_no.fill.solid()
    box_no.fill.fore_color.rgb = RGBColor(254, 226, 226)
    box_no.line.color.rgb = RGBColor(239, 68, 68)
    tf_n = box_no.text_frame
    pn = tf_n.paragraphs[0]
    pn.text = "❌ Sai Lệch: 401/403\n(Chặn ngay lập tức)"
    pn.font.size = Pt(13)
    pn.font.bold = True
    pn.font.color.rgb = RGBColor(185, 28, 28)
    pn.alignment = PP_ALIGN.CENTER

    # --- SLIDE 8: Architecture Design & Workflow ---
    s8 = prs.slides.add_slide(blank_layout)
    tb8_title = s8.shapes.add_textbox(Inches(1.0), Inches(0.4), Inches(11.3), Inches(0.8))
    tf8_title = tb8_title.text_frame
    p8 = tf8_title.paragraphs[0]
    p8.text = "ARCHITECTURE DESIGN & WORKFLOW"
    p8.font.size = Pt(32)
    p8.font.bold = True
    p8.font.color.rgb = C_ORANGE

    # Embed serpentine image
    img_path = os.path.join("docs", "images", "firebase_workflow_serpentine.jpg")
    if os.path.exists(img_path):
        s8.shapes.add_picture(img_path, Inches(3.666), Inches(1.3), width=Inches(6.0))

    # --- SLIDE 9: CI/CD Pipeline & Deployment ---
    s9 = prs.slides.add_slide(blank_layout)
    tb9_title = s9.shapes.add_textbox(Inches(1.0), Inches(0.5), Inches(11.3), Inches(0.8))
    tf9_title = tb9_title.text_frame
    p9 = tf9_title.paragraphs[0]
    p9.text = "AUTOMATED CI/CD PIPELINE & DEPLOYMENT"
    p9.font.size = Pt(32)
    p9.font.bold = True
    p9.font.color.rgb = C_ORANGE

    tb9_sub = s9.shapes.add_textbox(Inches(1.0), Inches(1.3), Inches(11.3), Inches(0.6))
    tf9_sub = tb9_sub.text_frame
    tf9_sub.word_wrap = True
    p9_sub = tf9_sub.paragraphs[0]
    p9_sub.text = "Tự động hóa hoàn toàn quy trình đóng gói & triển khai ứng dụng lên CDN toàn cầu của Google qua GitHub Actions"
    p9_sub.font.size = Pt(15)
    p9_sub.font.color.rgb = C_SLATE

    # 4 Workflow Steps
    steps = [
        ("1. Git Push Code", "Developer đẩy code mới\nlên nhánh main GitHub", C_CYAN, Inches(1.0)),
        ("2. Actions Trigger", "GitHub lắng nghe push event,\nbật Ubuntu Runner ảo", C_ORANGE, Inches(4.0)),
        ("3. Automated Build", "Cài đặt npm ci, nạp secrets\nvà đóng gói npm run build", C_DARK, Inches(7.0)),
        ("4. Firebase Deploy", "Service Account đẩy dist/\nlên CDN toàn cầu live", C_GREEN, Inches(10.0)),
    ]

    for title, desc, col, x_pos in steps:
        box = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x_pos, Inches(2.1), Inches(2.3), Inches(2.1))
        box.fill.solid()
        box.fill.fore_color.rgb = C_LIGHT_BG
        box.line.color.rgb = col
        box.line.width = Pt(2)
        tf = box.text_frame
        tf.word_wrap = True
        
        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(15)
        p_t.font.bold = True
        p_t.font.color.rgb = col
        p_t.alignment = PP_ALIGN.CENTER
        
        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(13)
        p_d.font.color.rgb = C_DARK
        p_d.alignment = PP_ALIGN.CENTER
        p_d.space_before = Pt(10)

    # 3 Arrows between steps
    arrows_x = [Inches(3.38), Inches(6.38), Inches(9.38)]
    for ax in arrows_x:
        tb_a = s9.shapes.add_textbox(ax, Inches(2.8), Inches(0.5), Inches(0.5))
        tf_a = tb_a.text_frame
        pa = tf_a.paragraphs[0]
        pa.text = "➔"
        pa.font.size = Pt(22)
        pa.font.bold = True
        pa.font.color.rgb = C_CARD_BORDER
        pa.alignment = PP_ALIGN.CENTER

    # 3 Benefits on Bottom
    benefits = [
        ("🔄 Continuous Delivery", "Đảm bảo frontend luôn tích hợp tức thời với hệ thống Microservices backend."),
        ("⚡ Zero Downtime", "Triển khai phiên bản ổn định toàn cầu mà không làm gián đoạn người dùng."),
        ("🛡️ Tách Biệt Quản Trị", "Loại bỏ hoàn toàn rủi ro deploy thủ công từ localhost, chuẩn hóa quy trình công nghiệp."),
    ]
    b_widths = Inches(3.6)
    b_xs = [Inches(1.0), Inches(4.85), Inches(8.7)]
    for (b_title, b_desc), bx in zip(benefits, b_xs):
        box_b = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bx, Inches(4.5), b_widths, Inches(2.3))
        box_b.fill.solid()
        box_b.fill.fore_color.rgb = C_BLUE_BG
        box_b.line.color.rgb = C_CARD_BORDER
        tf_b = box_b.text_frame
        tf_b.word_wrap = True
        
        pb_t = tf_b.paragraphs[0]
        pb_t.text = b_title
        pb_t.font.size = Pt(15)
        pb_t.font.bold = True
        pb_t.font.color.rgb = C_DARK
        
        pb_d = tf_b.add_paragraph()
        pb_d.text = b_desc
        pb_d.font.size = Pt(13)
        pb_d.font.color.rgb = C_SLATE
        pb_d.space_before = Pt(8)

    # Colors for extensions
    C_RED = RGBColor(239, 68, 68)          # #EF4444
    C_PURPLE = RGBColor(147, 51, 234)      # #9333EA
    C_YELLOW_BG = RGBColor(254, 243, 199)  # #FEF3C7
    C_YELLOW_BORDER = RGBColor(245, 158, 11)# #F59E0B

    # --- SLIDE 10: Real-World CI/CD: Fail-Safe & Zero-Downtime Rollback ---
    s10 = prs.slides.add_slide(blank_layout)
    tb10_title = s10.shapes.add_textbox(Inches(1.0), Inches(0.4), Inches(11.3), Inches(0.8))
    tf10_title = tb10_title.text_frame
    p10 = tf10_title.paragraphs[0]
    p10.text = "CI/CD THỰC CHIẾN: FAIL-SAFE & ZERO-DOWNTIME ROLLBACK"
    p10.font.size = Pt(30)
    p10.font.bold = True
    p10.font.color.rgb = C_ORANGE

    tb10_sub = s10.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(11.3), Inches(0.5))
    tf10_sub = tb10_sub.text_frame
    tf10_sub.word_wrap = True
    p10_sub = tf10_sub.paragraphs[0]
    p10_sub.text = "Kiểm chứng 3 kịch bản vận hành thực tế & khả năng tự bảo vệ của hạ tầng Cloud"
    p10_sub.font.size = Pt(14)
    p10_sub.font.color.rgb = C_SLATE

    # 3 Scenario Cards
    scenarios = [
        ("🟢 1. Happy Path", C_GREEN, [
            "• Developer commit code đúng lên nhánh main.",
            "• GitHub Runner nạp 8 Secrets mã hóa AES-256.",
            "• npm run build pass -> Deploy lên CDN Firebase.",
            "• Kết quả: Web toàn cầu cập nhật tức thì trong ~1 phút."
        ], Inches(1.0)),
        ("🟡 2. Runtime Error", C_YELLOW_BORDER, [
            "• Code sai logic (VD: biến chưa khai báo).",
            "• npm run build vẫn pass do đúng cú pháp đóng gói.",
            "• Lên Web bị MÀN HÌNH TRẮNG (F12 Console báo đỏ).",
            "• Bài học: Cần bổ sung Automated Tests & TypeScript."
        ], Inches(4.85)),
        ("🔴 3. Build Fail-Safe", C_RED, [
            "• Code vỡ biên dịch (VD: import file không tồn tại).",
            "• npm run build báo đỏ ❌ -> CI/CD NGẮT NGAY LẬP TỨC!",
            "• Bước Deploy bị hủy (Skipped) -> Code độc bị chặn đứng.",
            "• Web VẪN HOẠT ĐỘNG 100%: CDN giữ nguyên bản cũ ổn định."
        ], Inches(8.7)),
    ]

    for sc_title, sc_color, sc_bullets, sc_x in scenarios:
        box_sc = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, sc_x, Inches(1.8), Inches(3.6), Inches(3.7))
        box_sc.fill.solid()
        box_sc.fill.fore_color.rgb = C_LIGHT_BG
        box_sc.line.color.rgb = sc_color
        box_sc.line.width = Pt(2)
        tf_sc = box_sc.text_frame
        tf_sc.word_wrap = True

        p_sct = tf_sc.paragraphs[0]
        p_sct.text = sc_title
        p_sct.font.size = Pt(16)
        p_sct.font.bold = True
        p_sct.font.color.rgb = sc_color

        for bullet in sc_bullets:
            p_scb = tf_sc.add_paragraph()
            p_scb.text = bullet
            p_scb.font.size = Pt(12)
            p_scb.font.color.rgb = C_DARK
            p_scb.space_before = Pt(8)

    # Bottom Banner: Release History & Rollback
    box_rb = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(5.7), Inches(11.3), Inches(1.3))
    box_rb.fill.solid()
    box_rb.fill.fore_color.rgb = C_BLUE_BG
    box_rb.line.color.rgb = C_CYAN
    box_rb.line.width = Pt(1.5)
    tf_rb = box_rb.text_frame
    tf_rb.word_wrap = True

    p_rbt = tf_rb.paragraphs[0]
    p_rbt.text = "🔍 QUẢN LÝ PHIÊN BẢN TRÊN FIREBASE CONSOLE & ROLLBACK 1-CLICK"
    p_rbt.font.size = Pt(14)
    p_rbt.font.bold = True
    p_rbt.font.color.rgb = C_CYAN
    p_rbt.alignment = PP_ALIGN.CENTER

    p_rbd = tf_rb.add_paragraph()
    p_rbd.text = "Mỗi lần deploy được lưu thành 1 snapshot độc lập trên Firebase Console. Nếu một phiên bản gặp sự cố logic bất ngờ, DevOps engineer chỉ cần bấm nút 'Rollback' trên Console để khôi phục bản cũ an toàn trong chưa đầy 1 giây mà không cần build lại mã nguồn!"
    p_rbd.font.size = Pt(12)
    p_rbd.font.color.rgb = C_DARK
    p_rbd.alignment = PP_ALIGN.CENTER
    p_rbd.space_before = Pt(4)

    # --- SLIDE 11: Cross-System Integration & Single Sign-On (SSO) ---
    s11 = prs.slides.add_slide(blank_layout)
    tb11_title = s11.shapes.add_textbox(Inches(1.0), Inches(0.4), Inches(11.3), Inches(0.8))
    tf11_title = tb11_title.text_frame
    p11 = tf11_title.paragraphs[0]
    p11.text = "CROSS-SYSTEM INTEGRATION: FEDERATED SINGLE SIGN-ON"
    p11.font.size = Pt(30)
    p11.font.bold = True
    p11.font.color.rgb = C_ORANGE

    tb11_sub = s11.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(11.3), Inches(0.5))
    tf11_sub = tb11_sub.text_frame
    tf11_sub.word_wrap = True
    p11_sub = tf11_sub.paragraphs[0]
    p11_sub.text = "Tích hợp 2 hệ sinh thái độc lập: Firebase Cloud-Native (Stateless) vs Google OAuth 2.0 (Stateful SQL Server)"
    p11_sub.font.size = Pt(14)
    p11_sub.font.color.rgb = C_SLATE

    # Left Box: System 1 (Firebase)
    box_s1 = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.8), Inches(5.5), Inches(3.9))
    box_s1.fill.solid()
    box_s1.fill.fore_color.rgb = C_LIGHT_BG
    box_s1.line.color.rgb = C_CYAN
    box_s1.line.width = Pt(2)
    tf_s1 = box_s1.text_frame
    tf_s1.word_wrap = True

    p_s1_head = tf_s1.paragraphs[0]
    p_s1_head.text = "🔵 HỆ THỐNG 1: FIREBASE CLOUD-NATIVE"
    p_s1_head.font.size = Pt(15)
    p_s1_head.font.bold = True
    p_s1_head.font.color.rgb = C_CYAN

    p_s1_auth = tf_s1.add_paragraph()
    p_s1_auth.text = "Dự án của bạn: Lê Phú & Vũ Giang Huy"
    p_s1_auth.font.size = Pt(11)
    p_s1_auth.font.bold = True
    p_s1_auth.font.color.rgb = C_SLATE
    p_s1_auth.space_before = Pt(2)

    s1_points = [
        "• Mô hình: Identity-as-a-Service (IDaaS) hoàn toàn trên Cloud.",
        "• Cơ sở dữ liệu: Stateless — Không cần Database lưu User/Password.",
        "• Xác thực Token: ID Token JWT ký số thuật toán RS256.",
        "• Hiệu năng: Giải mã Offline tại RAM < 1ms qua Public Keys (JWKS).",
        "• Phân quyền: Firebase Custom Claims gắn trực tiếp trong Token."
    ]
    for pt in s1_points:
        p_pt = tf_s1.add_paragraph()
        p_pt.text = pt
        p_pt.font.size = Pt(12)
        p_pt.font.color.rgb = C_DARK
        p_pt.space_before = Pt(6)

    # Right Box: System 2 (OAuth2 / Quan)
    box_s2 = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.5), Inches(3.9))
    box_s2.fill.solid()
    box_s2.fill.fore_color.rgb = C_LIGHT_BG
    box_s2.line.color.rgb = C_GREEN
    box_s2.line.width = Pt(2)
    tf_s2 = box_s2.text_frame
    tf_s2.word_wrap = True

    p_s2_head = tf_s2.paragraphs[0]
    p_s2_head.text = "🟢 HỆ THỐNG 2: GOOGLE OAUTH 2.0 & SQL SERVER"
    p_s2_head.font.size = Pt(15)
    p_s2_head.font.bold = True
    p_s2_head.font.color.rgb = RGBColor(21, 128, 61)

    p_s2_auth = tf_s2.add_paragraph()
    p_s2_auth.text = "Dự án của Quân (soa-auth-system)"
    p_s2_auth.font.size = Pt(11)
    p_s2_auth.font.bold = True
    p_s2_auth.font.color.rgb = C_SLATE
    p_s2_auth.space_before = Pt(2)

    s2_points = [
        "• Mô hình: Spring Boot Security + OAuth 2.0 lưu Database riêng.",
        "• Cơ sở dữ liệu: Stateful — Lưu hồ sơ User trong SQL Server 2022 / H2.",
        "• Xác thực Token: Custom JWT do Backend tự ký bằng HMAC-SHA384.",
        "• Hiệu năng: Quản lý phiên Session, Blacklist Token và Refresh Token.",
        "• Phân quyền: Phân quyền động (ROLE_PERSONAL / ROLE_STUDENT)."
    ]
    for pt in s2_points:
        p_pt = tf_s2.add_paragraph()
        p_pt.text = pt
        p_pt.font.size = Pt(12)
        p_pt.font.color.rgb = C_DARK
        p_pt.space_before = Pt(6)

    # Bottom Convergence Banner
    box_sso = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(5.9), Inches(11.3), Inches(1.1))
    box_sso.fill.solid()
    box_sso.fill.fore_color.rgb = C_YELLOW_BG
    box_sso.line.color.rgb = C_YELLOW_BORDER
    tf_sso = box_sso.text_frame
    tf_sso.word_wrap = True

    p_sso_t = tf_sso.paragraphs[0]
    p_sso_t.text = "🌟 ĐIỂM HỘI TỤ SOA: 1 CLICK GOOGLE -> 2 TOKEN -> 2 BACKEND -> 2 DATABASE"
    p_sso_t.font.size = Pt(13)
    p_sso_t.font.bold = True
    p_sso_t.font.color.rgb = RGBColor(180, 83, 9)
    p_sso_t.alignment = PP_ALIGN.CENTER

    p_sso_d = tf_sso.add_paragraph()
    p_sso_d.text = "Người dùng chỉ đăng nhập 1 lần duy nhất bằng Google trên giao diện Web. Hệ thống tự động phân phối danh tính đến cả 2 Backend, cấp 2 Token JWT riêng biệt và ghi dữ liệu đồng thời vào 2 Database mà không cần nhập lại mật khẩu!"
    p_sso_d.font.size = Pt(11)
    p_sso_d.font.color.rgb = C_DARK
    p_sso_d.alignment = PP_ALIGN.CENTER
    p_sso_d.space_before = Pt(4)

    # --- SLIDE 12: Technical Bottleneck & Solution ---
    s12 = prs.slides.add_slide(blank_layout)
    tb12_title = s12.shapes.add_textbox(Inches(1.0), Inches(0.4), Inches(11.3), Inches(0.8))
    tf12_title = tb12_title.text_frame
    p12 = tf12_title.paragraphs[0]
    p12.text = "TẠI SAO CODE CŨ CỦA QUÂN THẤT BẠI? & GIẢI PHÁP"
    p12.font.size = Pt(30)
    p12.font.bold = True
    p12.font.color.rgb = C_ORANGE

    tb12_sub = s12.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(11.3), Inches(0.5))
    tf12_sub = tb12_sub.text_frame
    tf12_sub.word_wrap = True
    p12_sub = tf12_sub.paragraphs[0]
    p12_sub.text = "Giải quyết bài toán xung đột cơ chế xác thực giữa OAuth 2.0 Authorization Code Grant và Firebase Popup SDK"
    p12_sub.font.size = Pt(14)
    p12_sub.font.color.rgb = C_SLATE

    # 3 Problem Cards
    problems = [
        ("❌ 1. Lệch Luồng Grant Type", [
            "• Code cũ của Quân dùng Authorization Code Grant (bắt buộc redirect toàn trang để lấy mã code).",
            "• Firebase Frontend dùng Popup SDK: Xác thực xong tại Client, HOÀN TOÀN KHÔNG CÓ mã code nào để gửi về callback!"
        ], Inches(1.0)),
        ("❌ 2. Token Firebase Lệch Issuer", [
            "• Token Firebase do securetoken.google.com/<project> ký số.",
            "• Backend của Quân không cài Firebase Admin SDK và không có private key dự án Firebase -> Lỗi Invalid Signature ngay!"
        ], Inches(4.85)),
        ("❌ 3. Thiếu API Tiếp Nhận", [
            "• Controller cũ của Quân chỉ có endpoint nhận code (/google/callback).",
            "• Hoàn toàn thiếu endpoint nhận Token đã xác thực từ Client bên thứ ba."
        ], Inches(8.7)),
    ]

    for p_title, p_bullets, p_x in problems:
        box_p = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, p_x, Inches(1.8), Inches(3.6), Inches(2.7))
        box_p.fill.solid()
        box_p.fill.fore_color.rgb = RGBColor(254, 242, 242) # Light red
        box_p.line.color.rgb = C_RED
        box_p.line.width = Pt(1.5)
        tf_p = box_p.text_frame
        tf_p.word_wrap = True

        p_pt = tf_p.paragraphs[0]
        p_pt.text = p_title
        p_pt.font.size = Pt(15)
        p_pt.font.bold = True
        p_pt.font.color.rgb = C_RED

        for bullet in p_bullets:
            p_pb = tf_p.add_paragraph()
            p_pb.text = bullet
            p_pb.font.size = Pt(12)
            p_pb.font.color.rgb = C_DARK
            p_pb.space_before = Pt(8)

    # Solution Box (Bottom)
    box_sol = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(4.7), Inches(11.3), Inches(2.3))
    box_sol.fill.solid()
    box_sol.fill.fore_color.rgb = RGBColor(240, 253, 244) # Light green
    box_sol.line.color.rgb = C_GREEN
    box_sol.line.width = Pt(2)
    tf_sol = box_sol.text_frame
    tf_sol.word_wrap = True

    p_sol_t = tf_sol.paragraphs[0]
    p_sol_t.text = "💡 GIẢI PHÁP ĐỘT PHÁ: FEDERATED IDENTITY TOKEN EXCHANGE"
    p_sol_t.font.size = Pt(15)
    p_sol_t.font.bold = True
    p_sol_t.font.color.rgb = RGBColor(21, 128, 61)

    sol_bullets = [
        "1. Phía Frontend: Trích xuất thêm credential.idToken (Google ID Token gốc do chính Google ký bằng RS256).",
        "2. Phía Backend Quân: Mở endpoint mới POST /api/auth/google/firebase-token nhận idToken.",
        "3. Xác thực bằng GoogleIdTokenVerifier: Backend Quân tự verify chữ ký RS256 với Google Public Keys (JWKS).",
        "4. Tự động lưu Database & Cấp JWT: Tận dụng hàm processGoogleUserInfo lưu user vào DB và cấp JWT riêng (HMAC-384)."
    ]
    for bullet in sol_bullets:
        p_sb = tf_sol.add_paragraph()
        p_sb.text = bullet
        p_sb.font.size = Pt(12)
        p_sb.font.color.rgb = C_DARK
        p_sb.space_before = Pt(4)

    # --- SLIDE 13: Visual Code Comparison (Before vs After) ---
    s13 = prs.slides.add_slide(blank_layout)
    tb13_title = s13.shapes.add_textbox(Inches(1.0), Inches(0.4), Inches(11.3), Inches(0.8))
    tf13_title = tb13_title.text_frame
    p13 = tf13_title.paragraphs[0]
    p13.text = "SO SÁNH CODE TRỰC QUAN: BEFORE VS AFTER"
    p13.font.size = Pt(30)
    p13.font.bold = True
    p13.font.color.rgb = C_ORANGE

    tb13_sub = s13.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(11.3), Inches(0.5))
    tf13_sub = tb13_sub.text_frame
    tf13_sub.word_wrap = True
    p13_sub = tf13_sub.paragraphs[0]
    p13_sub.text = "Minh họa chi tiết các đoạn mã nguồn đã tinh chỉnh trên cả Frontend và Backend"
    p13_sub.font.size = Pt(14)
    p13_sub.font.color.rgb = C_SLATE

    # Left Code Box: Frontend
    box_c1 = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.8), Inches(5.5), Inches(5.2))
    box_c1.fill.solid()
    box_c1.fill.fore_color.rgb = C_DARK
    box_c1.line.color.rgb = C_CYAN
    box_c1.line.width = Pt(2)
    tf_c1 = box_c1.text_frame
    tf_c1.word_wrap = True

    p_c1_t = tf_c1.paragraphs[0]
    p_c1_t.text = "💻 FRONTEND: GoogleSignIn.jsx"
    p_c1_t.font.size = Pt(14)
    p_c1_t.font.bold = True
    p_c1_t.font.color.rgb = RGBColor(56, 189, 248)

    fe_code = (
        "// ❌ TRƯỚC: Chỉ lấy Token nội bộ Firebase\n"
        "const result = await signInWithPopup(auth, provider);\n"
        "const fbToken = await result.user.getIdToken();\n"
        "navigate('/dashboard');\n\n"
        "// ✅ SAU: Trích xuất thêm Google ID Token thật\n"
        "const result = await signInWithPopup(auth, provider);\n"
        "const cred = GoogleAuthProvider\n"
        "                .credentialFromResult(result);\n"
        "if (cred?.idToken) {\n"
        "  // Gửi sang Quân qua endpoint mới (chạy ngầm)\n"
        "  syncToOAuth2Backend(cred.idToken);\n"
        "}\n"
        "navigate('/dashboard');"
    )
    p_fe = tf_c1.add_paragraph()
    p_fe.text = fe_code
    p_fe.font.size = Pt(11)
    p_fe.font.name = "Consolas"
    p_fe.font.color.rgb = RGBColor(226, 232, 240)
    p_fe.space_before = Pt(8)

    # Right Code Box: Backend
    box_c2 = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.5), Inches(5.2))
    box_c2.fill.solid()
    box_c2.fill.fore_color.rgb = C_DARK
    box_c2.line.color.rgb = C_GREEN
    box_c2.line.width = Pt(2)
    tf_c2 = box_c2.text_frame
    tf_c2.word_wrap = True

    p_c2_t = tf_c2.paragraphs[0]
    p_c2_t.text = "⚙️ BACKEND QUÂN: AuthController & AuthService"
    p_c2_t.font.size = Pt(14)
    p_c2_t.font.bold = True
    p_c2_t.font.color.rgb = RGBColor(74, 222, 128)

    be_code = (
        "// ❌ TRƯỚC: Chỉ nhận code qua Callback URL\n"
        "@GetMapping(\"/google/callback\")\n"
        "public void callback(@RequestParam(\"code\") String code) {\n"
        "  // Bắt buộc phải có code đổi từ Google redirect\n"
        "}\n\n"
        "// ✅ SAU: Mở API nhận Token & verify Google JWKS\n"
        "@PostMapping(\"/google/firebase-token\")\n"
        "public ResponseEntity<?> login(@RequestBody Map body) {\n"
        "  String idToken = body.get(\"idToken\");\n"
        "  // 1. Verify chữ ký RS256 bằng GoogleIdTokenVerifier\n"
        "  GoogleIdToken token = verifier.verify(idToken);\n"
        "  // 2. Tự động lưu DB & cấp JWT riêng (HMAC-384)\n"
        "  return processGoogleUserInfo(token.getPayload());\n"
        "}"
    )
    p_be = tf_c2.add_paragraph()
    p_be.text = be_code
    p_be.font.size = Pt(11)
    p_be.font.name = "Consolas"
    p_be.font.color.rgb = RGBColor(226, 232, 240)
    p_be.space_before = Pt(8)

    # Save
    os.makedirs("slides", exist_ok=True)
    out_file = os.path.join("slides", "firebase_auth_seminar.pptx")
    prs.save(out_file)
    print(f"Presentation saved successfully to {out_file}")

if __name__ == "__main__":
    create_deck()
