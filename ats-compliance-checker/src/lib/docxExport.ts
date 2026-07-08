import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";
import { ResumeData } from "../types";

export function exportResumeToDocx(data: ResumeData, filename: string = "resume.docx") {
  const children: any[] = [];

  // --- 1. CONTACT HEADER ---
  // Name (20pt Bold, Arial)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
      children: [
        new TextRun({
          text: data.contact.name.toUpperCase(),
          bold: true,
          size: 40, // 20pt
          font: "Arial",
          color: "111111",
        }),
      ],
    })
  );

  // Sub-header contact info: phone, email, location, linkedin, portfolio
  const contactParts = [
    data.contact.phone,
    data.contact.email,
    data.contact.location,
    data.contact.linkedin,
    data.contact.portfolio
  ].filter(Boolean);

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 360 }, // Spacing after contact info
      children: [
        new TextRun({
          text: contactParts.join("  |  "),
          size: 20, // 10pt
          font: "Arial",
          color: "444444",
        }),
      ],
    })
  );

  // Divider function to add clean section headings
  function addSectionHeading(title: string) {
    children.push(
      new Paragraph({
        spacing: { before: 360, after: 120 },
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24, // 12pt
            font: "Arial",
            color: "111111",
          }),
        ],
      })
    );
  }

  // --- 2. PROFESSIONAL SUMMARY ---
  if (data.summary) {
    addSectionHeading("Professional Summary");
    children.push(
      new Paragraph({
        spacing: { before: 0, after: 120 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: data.summary,
            size: 21, // 10.5pt
            font: "Arial",
            color: "333333",
          }),
        ],
      })
    );
  }

  // --- 3. EXPERIENCE ---
  if (data.experience && data.experience.length > 0) {
    addSectionHeading("Work Experience");
    data.experience.forEach((exp) => {
      // Role & Company
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: `${exp.role} `,
              bold: true,
              size: 22, // 11pt
              font: "Arial",
              color: "111111",
            }),
            new TextRun({
              text: `|  ${exp.company}`,
              bold: false,
              size: 22, // 11pt
              font: "Arial",
              color: "222222",
            }),
          ],
        })
      );

      // Date & Location
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 80 },
          children: [
            new TextRun({
              text: `${exp.startDate} – ${exp.endDate}   |   ${exp.location}`,
              italics: true,
              size: 19, // 9.5pt
              font: "Arial",
              color: "555555",
            }),
          ],
        })
      );

      // Bullets
      exp.bullets.forEach((bullet) => {
        if (!bullet.trim()) return;
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 40 },
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: bullet,
                size: 21, // 10.5pt
                font: "Arial",
                color: "333333",
              }),
            ],
          })
        );
      });
    });
  }

  // --- 4. PROJECTS ---
  if (data.projects && data.projects.length > 0) {
    addSectionHeading("Key Projects");
    data.projects.forEach((proj) => {
      // Project Name & Tech Stack
      const projectHeaderParts = [
        new TextRun({
          text: proj.name,
          bold: true,
          size: 22, // 11pt
          font: "Arial",
          color: "111111",
        }),
      ];

      if (proj.technologies) {
        projectHeaderParts.push(
          new TextRun({
            text: `  (${proj.technologies})`,
            italics: true,
            size: 20, // 10pt
            font: "Arial",
            color: "444444",
          })
        );
      }

      if (proj.link) {
        projectHeaderParts.push(
          new TextRun({
            text: `  |  ${proj.link}`,
            size: 18, // 9pt
            font: "Arial",
            color: "0066cc",
          })
        );
      }

      children.push(
        new Paragraph({
          spacing: { before: 120, after: 80 },
          children: projectHeaderParts,
        })
      );

      // Bullets
      proj.bullets.forEach((bullet) => {
        if (!bullet.trim()) return;
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 40 },
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: bullet,
                size: 21, // 10.5pt
                font: "Arial",
                color: "333333",
              }),
            ],
          })
        );
      });
    });
  }

  // --- 5. EDUCATION ---
  if (data.education && data.education.length > 0) {
    addSectionHeading("Education");
    data.education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: `${edu.degree} in ${edu.fieldOfStudy} `,
              bold: true,
              size: 22,
              font: "Arial",
              color: "111111",
            }),
            new TextRun({
              text: `|  ${edu.institution}`,
              bold: false,
              size: 22,
              font: "Arial",
              color: "222222",
            }),
          ],
        })
      );

      children.push(
        new Paragraph({
          spacing: { before: 0, after: 60 },
          children: [
            new TextRun({
              text: `${edu.graduationDate}   |   ${edu.location}`,
              italics: true,
              size: 19,
              font: "Arial",
              color: "555555",
            }),
          ],
        })
      );

      if (edu.details && edu.details.trim()) {
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 120 },
            children: [
              new TextRun({
                text: edu.details,
                size: 21,
                font: "Arial",
                color: "444444",
              }),
            ],
          })
        );
      }
    });
  }

  // --- 6. SKILLS ---
  if (data.skills && data.skills.length > 0) {
    addSectionHeading("Skills & Core Competencies");
    children.push(
      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [
          new TextRun({
            text: data.skills.join(", "),
            size: 21,
            font: "Arial",
            color: "333333",
          }),
        ],
      })
    );
  }

  // --- 7. CERTIFICATIONS ---
  if (data.certifications && data.certifications.length > 0) {
    addSectionHeading("Certifications");
    data.certifications.forEach((cert) => {
      if (!cert.trim()) return;
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 60 },
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: cert,
              size: 21,
              font: "Arial",
              color: "333333",
            }),
          ],
        })
      );
    });
  }

  // Compile document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch (measured in twentieths of a point, dxas. 1440 = 1 inch)
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: children,
      },
    ],
  });

  // Pack to Blob and trigger client-side download
  Packer.toBlob(doc).then((blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }).catch((err) => {
    console.error("Failed to generate DOCX file:", err);
    alert("An error occurred while generating the DOCX document.");
  });
}
