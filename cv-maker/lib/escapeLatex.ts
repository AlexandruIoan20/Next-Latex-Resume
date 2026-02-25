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

const formatDates = (start?: string | null, end?: string | null) => {
    if (!start) return "";
    const startStr = escapeLatex(start);
    const endStr = end ? escapeLatex(end) : "Prezent";
    return `${startStr} -- ${endStr}`;
};

const formatBullets = (description: string | null | undefined): string => {
    if (!description) return "";
    const lines = description.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length === 0) return "";
    
    let result = `\\resumeItemListStart\n`;
    lines.forEach(line => {
        result += `\\resumeItem{${escapeLatex(line)}}\n`;
    });
    result += `\\resumeItemListEnd\n`;
    return result;
};

export const generateLatexCode = (data: any): string => {
    const { resume, contactDetails, experiences, education, projects, languages, abilities } = data;

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

\\titleformat {\\section}{
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
      #1 & {\\color{dark-grey}} \\\\
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

    if (contactDetails) {
        tex += `\\begin{center}\n`;
        tex += `\\textbf{\\Huge ${escapeLatex(contactDetails.firstName)} ${escapeLatex(contactDetails.lastName)}} \\\\ \\vspace{5pt}\n`;
        
        const contactLinks = [];
        if (contactDetails.phoneNumber) contactLinks.push(`\\small \\faPhone* \\texttt{${escapeLatex(contactDetails.phoneNumber)}}`);
        if (contactDetails.email) contactLinks.push(`\\faEnvelope \\hspace{2pt} \\texttt{${escapeLatex(contactDetails.email)}}`);
        if (contactDetails.linkedIn) contactLinks.push(`\\faLinkedin \\hspace{2pt} \\texttt{${escapeLatex(contactDetails.linkedIn)}}`);
        if (contactDetails.city) contactLinks.push(`\\faMapMarker* \\hspace{2pt}\\texttt{${escapeLatex(contactDetails.city)}}`);

        tex += contactLinks.join(` \\hspace{1pt} $|$ \\hspace{1pt} `);
        tex += ` \\\\ \\vspace{-3pt}\n\\end{center}\n\n`;
    }

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

    if (projects && projects.length > 0) {
        tex += `\\section{${escapeLatex(resume.projectsTitle).toUpperCase()}}\n`;
        tex += `\\resumeSubHeadingListStart\n`;
        
        projects.forEach((proj: any) => {
            let titleBlock = `\\textbf{${escapeLatex(proj.title)}}`;
            if (proj.techStack) {
                titleBlock += ` $|$ \\emph{${escapeLatex(proj.techStack)}}`;
            }
            if (proj.link) {
                titleBlock = `\\href{${escapeLatex(proj.link)}}{\\myuline{${titleBlock}}}`;
            }
            tex += `\\resumeProjectHeading{${titleBlock}}{}\n`;
            tex += formatBullets(proj.description);
        });
        
        tex += `\\resumeSubHeadingListEnd\n\n`;
    }

    if (education && education.length > 0) {
        tex += `\\section{${escapeLatex(resume.educationTitle).toUpperCase()}}\n`;
        tex += `\\resumeSubHeadingListStart\n`;
        
        education.forEach((edu: any) => {
            const dates = formatDates(edu.startDate, edu.finishDate);
            tex += `\\resumeSubheading{${escapeLatex(edu.school)}}{${dates}}{${escapeLatex(edu.degree)}}{}\n`;
        });
        
        tex += `\\resumeSubHeadingListEnd\n\n`;
    }

    const hasSkills = (languages && languages.length > 0) || (abilities && abilities.length > 0);
    if (hasSkills) {
        tex += `\\section{${escapeLatex(resume.abilitiesTitle).toUpperCase()}}\n`;
        tex += `\\begin{itemize}[leftmargin=0in, label={}]\n\\small{\\item{\n`;
        
        if (abilities && abilities.length > 0) {
            const abilitiesStr = abilities.map((a: any) => escapeLatex(a.title)).join(", ");
            tex += `\\textbf{Abilități} {: ${abilitiesStr}}\\vspace{2pt} \\\\\n`;
        }
        
        if (languages && languages.length > 0) {
            const langStr = languages.map((l: any) => `${escapeLatex(l.language)} (${escapeLatex(l.level)})`).join(", ");
            tex += `\\textbf{Limbi Străine} {: ${langStr}}\n`;
        }
        
        tex += `}}\n\\end{itemize}\n\n`;
    }

    tex += `\\end{document}\n`;

    return tex;
};