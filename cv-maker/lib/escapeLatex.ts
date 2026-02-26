export const escapeLatex = (text: string | null | undefined): string => {
  if (!text) return "";
  return String(text)
    .replace(/\\/g, "\\textbackslash ")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde ")
    .replace(/\^/g, "\\textasciicircum ");
};

const stripHtmlToPlainText = (html: string | null | undefined): string => {
  if (!html) return "";
  return html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const processRichText = (html: string | null | undefined): string => {
  if (!html) return "";
  let text = html;

  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');

  text = text.replace(/<br\s*\/?>/gi, " ");
  text = text.replace(/<\/(p|div)>/gi, " ");
  text = text.replace(/<(p|div)[^>]*>/gi, " ");

  let prev = "";
  while (prev !== text) {
    prev = text;
    text = text.replace(
      /<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi,
      (_, _tag, content) => `\\textbf{${escapeLatex(content)}}`
    );
    text = text.replace(
      /<(em|i)[^>]*>(.*?)<\/(em|i)>/gi,
      (_, _tag, content) => `\\textit{${escapeLatex(content)}}`
    );
    text = text.replace(
      /<u[^>]*>(.*?)<\/u>/gi,
      (_, content) => `\\uline{${escapeLatex(content)}}`
    );
  }

  text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, "---ITEM---$1\n");
  text = text.replace(/<[^>]*>/g, "");
  text = text.replace(/\s+/g, " ").trim();

  return text;
};

const formatDates = (start?: string | null, end?: string | null) => {
  if (!start) return "";
  const startStr = escapeLatex(start);
  const endStr = end ? escapeLatex(end) : "Present";
  return `${startStr} -- ${endStr}`;
};

const formatBullets = (description: string | null | undefined): string => {
  if (!description) return "";

  if (description.includes("---ITEM---") || description.includes("<li")) {
    const processed = description.includes("---ITEM---")
      ? description
      : processRichText(description);

    const lines = processed
      .split("---ITEM---")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) return "";

    let result = `\\resumeItemListStart\n`;
    lines.forEach((line) => {
      const cleanLine = line.replace(/<[^>]*>/g, "").trim();
      if (!cleanLine) return;

      // Detectăm dacă linia conține \textbf{...} în mijloc sau la final
      // ex: "text normal \textbf{Activities:}" sau "\textbf{Activities:}"
      const boldAtEndOrAlone = /(.*?)(\\textbf\{[^}]+\}:?\s*)$/.exec(cleanLine);

      if (boldAtEndOrAlone && boldAtEndOrAlone[1].trim()) {
        // Are text normal ÎNAINTE de bold → punem textul ca bullet normal
        // și boldul ca subtitlu pe rând nou
        const normalPart = boldAtEndOrAlone[1].trim();
        const boldPart = boldAtEndOrAlone[2].trim();

        result += `\\resumeItem{${normalPart}}\n`;
        result += `\\resumeItemListEnd\n`;
        result += `\\vspace{2pt}\\hspace{8pt}${boldPart}\\vspace{2pt}\n`;
        result += `\\resumeItemListStart\n`;
      } else if (/^\\textbf\{[^}]+\}:?\s*$/.test(cleanLine)) {
        // E doar bold singur → subtitlu
        result += `\\resumeItemListEnd\n`;
        result += `\\vspace{2pt}\\hspace{8pt}${cleanLine}\\vspace{2pt}\n`;
        result += `\\resumeItemListStart\n`;
      } else {
        result += `\\resumeItem{${cleanLine}}\n`;
      }
    });

    result += `\\resumeItemListEnd\n`;
    return result;
  }

  const plainText = processRichText(description);
  return plainText ? `\\small{${plainText}}\\\\ \n` : "";
};

export const generateLatexCode = (data: any): string => {
  const {
    resume,
    contactDetails,
    experiences,
    education,
    projects,
    courses,
    languages,
    abilities,
    interests,
  } = data;

  const preamble = `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage[scale=0.90,lf]{FiraMono}
\\definecolor{light-grey}{gray}{0.83}
\\definecolor{dark-grey}{gray}{0.3}
\\definecolor{text-grey}{gray}{.08}
\\DeclareRobustCommand{\\ebseries}{\\fontseries{eb}\\selectfont}
\\DeclareTextFontCommand{\\texteb}{\\ebseries}
\\usepackage{contour}
\\usepackage[normalem]{ulem}
\\renewcommand{\\ULdepth}{1.8pt}
\\contourlength{0.8pt}
\\newcommand{\\myuline}[1]{%
  \\uline{\\phantom{#1}}%
  \\llap{\\contour{white}{#1}}%
}
\\usepackage{tgheros}
\\renewcommand*\\familydefault{\\sfdefault}
\\usepackage[T1]{fontenc}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{0in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}
\\titleformat{\\section}{
  \\bfseries \\vspace{2pt} \\raggedright \\large
}{}{0em}{}[\\color{light-grey} {\\titlerule[2pt]} \\vspace{-4pt}]
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-1pt}}
  }
}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & {\\color{dark-grey}\\small #2}\\vspace{1pt}\\\\
      \\textit{#3} & {\\color{dark-grey} \\small #4}\\\\
    \\end{tabular*}\\vspace{-4pt}
}
\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
      #1 & {\\color{dark-grey}\\small #2} \\\\
    \\end{tabular*}\\vspace{-4pt}
}
\\newcommand{\\resumeCourseHeading}[3]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & {\\color{dark-grey}\\small #2}\\vspace{1pt}\\\\
      \\textit{\\small #3} & \\\\
    \\end{tabular*}\\vspace{-4pt}
}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{0pt}}
\\color{text-grey}
\\begin{document}
`;

  let tex = preamble;

  // ── HEADER ──────────────────────────────────────────────────────────────────
  if (contactDetails) {
    tex += `\\begin{center}\n`;
    tex += `\\textbf{\\Huge ${escapeLatex(contactDetails.lastName)} ${escapeLatex(contactDetails.firstName)}} \\\\ \\vspace{5pt}\n`;

    const linkItems: string[] = [];
    if (contactDetails.linkedIn) {
      linkItems.push(
        `\\faLinkedin\\ \\href{https://${escapeLatex(contactDetails.linkedIn)}}{\\myuline{\\texttt{${escapeLatex(contactDetails.linkedIn)}}}}`
      );
    }
    if (contactDetails.personalWebsite) {
      linkItems.push(
        `\\faGlobe\\ \\href{https://${escapeLatex(contactDetails.personalWebsite)}}{\\myuline{\\texttt{${escapeLatex(contactDetails.personalWebsite)}}}}`
      );
    }
    if (linkItems.length > 0) {
      tex += linkItems.join(` \\hspace{8pt} `) + ` \\\\ \\vspace{3pt}\n`;
    }

    const contactItems: string[] = [];
    if (contactDetails.phoneNumber) {
      contactItems.push(
        `\\faPhone*\\ \\texttt{${escapeLatex(contactDetails.phoneNumber)}}`
      );
    }
    if (contactDetails.email) {
      contactItems.push(
        `\\faEnvelope\\ \\href{mailto:${escapeLatex(contactDetails.email)}}{\\texttt{${escapeLatex(contactDetails.email)}}}`
      );
    }
    if (contactDetails.city) {
      contactItems.push(
        `\\faMapMarker*\\ \\texttt{${escapeLatex(contactDetails.city)}}`
      );
    }
    if (contactItems.length > 0) {
      tex +=
        contactItems.join(` \\hspace{1pt} $|$ \\hspace{1pt} `) +
        ` \\\\ \\vspace{-3pt}\n`;
    }

    tex += `\\end{center}\n\n`;
  }

  // ── EXPERIENȚE ──────────────────────────────────────────────────────────────
  if (experiences && experiences.length > 0) {
    tex += `\\section{${escapeLatex(resume.experiencesTitle).toUpperCase()}}\n`;
    tex += `\\resumeSubHeadingListStart\n`;
    experiences.forEach((exp: any) => {
      const dates = formatDates(exp.startDate, exp.finishDate);
      tex += `\\resumeSubheading{${escapeLatex(exp.employer)}}{${dates}}{${escapeLatex(exp.title)}}{${escapeLatex(exp.city)}}\n`;
      tex += formatBullets(exp.description);
    });
    tex += `\\resumeSubHeadingListEnd\n\n`;
  }

  // ── PROIECTE ────────────────────────────────────────────────────────────────
  if (projects && projects.length > 0) {
    tex += `\\section{${escapeLatex(resume.projectsTitle).toUpperCase()}}\n`;
    tex += `\\resumeSubHeadingListStart\n`;
    projects.forEach((proj: any) => {
      const cleanTitle = escapeLatex(stripHtmlToPlainText(proj.title));
      const cleanTechStack = proj.techStack
        ? escapeLatex(stripHtmlToPlainText(proj.techStack))
        : null;

      // Titlu bold, urmat de " | TechStack italic" pe același rând
      let titleBlock = `\\textbf{${cleanTitle}}`;
      if (cleanTechStack) {
        titleBlock += ` {\\color{dark-grey} $|$} \\emph{\\small ${cleanTechStack}}`;
      }

      // Link clicabil pe titlu dacă există
      if (proj.link) {
        const linkPart = `\\href{${escapeLatex(proj.link)}}{\\myuline{\\textbf{${cleanTitle}}}}`;
        titleBlock = cleanTechStack
          ? `${linkPart} {\\color{dark-grey} $|$} \\emph{\\small ${cleanTechStack}}`
          : linkPart;
      }

      tex += `\\resumeProjectHeading{${titleBlock}}{}\n`;
      tex += formatBullets(proj.description);
    });
    tex += `\\resumeSubHeadingListEnd\n\n`;
  }

  // ── EDUCAȚIE ────────────────────────────────────────────────────────────────
  if (education && education.length > 0) {
    tex += `\\section{${escapeLatex(resume.educationTitle).toUpperCase()}}\n`;
    tex += `\\resumeSubHeadingListStart\n`;
    education.forEach((edu: any) => {
      const dates = formatDates(edu.startDate, edu.finishDate);
      tex += `\\resumeSubheading{${escapeLatex(edu.school)}}{${dates}}{${escapeLatex(edu.degree)}}{}\n`;
    });
    tex += `\\resumeSubHeadingListEnd\n\n`;
  }

  // ── CURSURI ─────────────────────────────────────────────────────────────────
  if (courses && courses.length > 0) {
    tex += `\\section{${escapeLatex(resume.coursesTitle).toUpperCase()}}\n`;
    tex += `\\resumeSubHeadingListStart\n`;
    courses.forEach((course: any) => {
      const dates = formatDates(course.startDate, course.finishDate);
      const institution = course.institution
        ? escapeLatex(course.institution)
        : "";
      tex += `\\resumeCourseHeading{${escapeLatex(course.title)}}{${dates}}{${institution}}\n`;
    });
    tex += `\\resumeSubHeadingListEnd\n\n`;
  }

  // ── ABILITĂȚI ───────────────────────────────────────────────────────────────
    if (abilities && abilities.length > 0) {
    tex += `\\section{${escapeLatex(resume.abilitiesTitle).toUpperCase()}}\n`;
    tex += `\\begin{itemize}[leftmargin=0in, label={}]\n\\small{\\item{\n`;

    // Împărțim abilitățile în coloane de câte 2
    const cols = 2;
    const rows = Math.ceil(abilities.length / cols);

    tex += `\\begin{tabular*}{\\textwidth}{@{}p{0.46\\textwidth}@{\\hspace{20pt}}p{0.46\\textwidth}@{}}\n`;

    for (let row = 0; row < rows; row++) {
        const rowItems: string[] = [];

        for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;
        if (idx >= abilities.length) {
            rowItems.push(""); 
            continue;
        }

        const ability = abilities[idx];
        const title = escapeLatex(ability.title);
        const level = parseInt(ability.level ?? "0", 10);
        const maxLevel = 6;

        // Dots: ● filled, ○ empty
        const filledDot = `{\\color{text-grey}$\\bullet$}`;
        const emptyDot  = `{\\color{light-grey}$\\bullet$}`;

        const dots = Array.from({ length: maxLevel }, (_, i) =>
            i < level ? filledDot : emptyDot
        ).join("\\,");

        rowItems.push(`\\textbf{${title}} \\hfill ${dots}`);
        }

        tex += rowItems.join(" & ") + ` \\\\\[2pt]\n`;
    }

    tex += `\\end{tabular*}\n`;
    tex += `}}\n\\end{itemize}\n\n`;
    }

  // ── LIMBI STRĂINE ───────────────────────────────────────────────────────────
  // Format: English — B2   (nume bold, linie, nivel italic gri)
  if (languages && languages.length > 0) {
    tex += `\\section{${escapeLatex(resume.languagesTitle).toUpperCase()}}\n`;
    tex += `\\begin{itemize}[leftmargin=0in, label={}]\n\\small{\\item{\n`;
    tex += `\\begin{tabular}{@{}ll@{}}\n`;
    languages.forEach((l: any, index: number) => {
      const lang = escapeLatex(l.language);
      const level = escapeLatex(l.level);
      tex += `\\textbf{${lang}} {\\color{light-grey}---} {\\color{dark-grey}\\textit{${level}}}`;
      if (index < languages.length - 1) tex += ` \\\\\[3pt]\n`;
      else tex += `\n`;
    });
    tex += `\\end{tabular}\n`;
    tex += `}}\n\\end{itemize}\n\n`;
  }

  // ── INTERESE ────────────────────────────────────────────────────────────────
  // Format: pill-style tags separați prin bullet
  if (interests && interests.length > 0) {
    tex += `\\section{${escapeLatex(resume.interestsTitle).toUpperCase()}}\n`;
    tex += `\\begin{itemize}[leftmargin=0in, label={}]\n\\small{\\item{\n`;
    const interestsStr = interests
      .map((i: any) => escapeLatex(i.title))
      .join(" $\\cdot$ ");
    tex += `${interestsStr}\n`;
    tex += `}}\n\\end{itemize}\n\n`;
  }

  tex += `\\end{document}\n`;
  return tex;
};