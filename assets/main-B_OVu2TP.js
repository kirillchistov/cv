import{g as r,r as g,i as p,a as h}from"./topbar-B9W-Yt3E.js";import{p as b}from"./projects-DXZxZiD-.js";function o(t,e){const n=document.querySelector(`[data-error-for="${t}"]`);n&&(n.textContent=e||"")}function E(t){return/\S+@\S+\.\S+/.test(t)}function v(){const t=document.getElementById("contactForm"),e=document.getElementById("formStatus");t&&t.addEventListener("submit",n=>{n.preventDefault();const i=t.elements.namedItem("name").value.trim(),c=t.elements.namedItem("email").value.trim(),s=t.elements.namedItem("message").value.trim(),a=document.documentElement.getAttribute("data-lang")||"ru";let m=!1;if(i?o("name",""):(o("name",r("errName",a)),m=!0),c?E(c)?o("email",""):(o("email",r("errEmailBad",a)),m=!0):(o("email",r("errEmailEmpty",a)),m=!0),s?o("message",""):(o("message",r("errMsg",a)),m=!0),m){e&&(e.textContent="");return}const d=encodeURIComponent(r("mailSubject",a)),u=encodeURIComponent(`${r("formNameLabel",a)}: ${i}
Email: ${c}

${r("formMsgLabel",a)}:
${s}`),f=`mailto:kchistov@gmail.com?subject=${d}&body=${u}`;window.location.href=f,e&&(e.textContent=r("formStatus",a))})}function $(t){const e=t.match(/github\.com\/kirillchistov\/([^/?#]+)/);if(e)return`https://github.com/kirillchistov/${e[1]}`;const n=t.match(/kirillchistov\.github\.io\/([^/?#]+)/);return n?`https://github.com/kirillchistov/${n[1]}`:t}function k(t){const e=document.getElementById("projectsGrid");e&&t.forEach(n=>{const i=document.createElement("article");i.className="project-card",i.innerHTML=`
      <h3 class="project-name">
        <a href="${n.url}" target="_blank" rel="noopener">${n.name}</a>
      </h3>
      <p class="project-desc">${n.description}</p>
      <div class="project-meta">
        <div class="project-tags">
          ${n.stack.map(c=>`<span class="project-tag">${c}</span>`).join("")}
        </div>
        <a href="${$(n.url)}" target="_blank" rel="noopener" class="project-link">
          GitHub
        </a>
      </div>
    `,e.appendChild(i)})}const l=document.getElementById("year");l&&(l.textContent=new Date().getFullYear().toString());function y(){window.print()}g(["theme","lang","pdf","roadmap","tailor","contact"],"cv");["pdfButton","pdfButtonBottom"].forEach(t=>{const e=document.getElementById(t);e&&e.addEventListener("click",y)});p();h();v();k(b);
