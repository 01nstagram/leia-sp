function e() {
    const e = document.getElementById("statusMessage")
      , t = document.getElementById("assignmentsContainer")
      , n = document.getElementById("contentSection")
      , o = document.getElementById("activityModal")
      , a = document.getElementById("modalOverlay")
      , s = document.getElementById("closeModal")
      , i = document.getElementById("modalTitle")
      , r = document.getElementById("modalContent")
      , l = document.getElementById("completeActivityBtn")
      , d = document.getElementById("readActivityBtn")
      , c = document.getElementById("bookmark-container")
      , m = document.querySelector(".video-toggle")
      , u = document.querySelector(".video-container")
      , p = document.getElementById("refreshButton")
      , g = document.getElementById("hideCompletedCheckbox")
      , y = document.getElementById("searchButton")
      , v = document.getElementById("searchModalOverlay")
      , h = document.getElementById("searchModal")
      , f = document.getElementById("closeSearchModal")
      , b = document.getElementById("searchInput")
      , k = document.getElementById("performSearchBtn")
      , E = document.getElementById("notificationOverlay")
      , w = document.getElementById("notificationTitle")
      , L = document.getElementById("notificationMessage")
      , A = document.getElementById("notificationOkBtn")
      , B = document.getElementById("closeNotification")
      , I = {};
    let x = null
      , C = null
      , S = null
      , $ = null
      , T = !1
      , M = null;
    g && g.addEventListener("change", ( () => {
        T = g.checked,
        $ && V($.assignments, $.searchBookV3)
    }
    ));
    let N = new URLSearchParams(window.location.search).get("key");
    if (N) {
        localStorage.setItem("leiaKey", N);
        const e = new URL(window.location);
        e.searchParams.delete("key"),
        window.history.replaceState({}, document.title, e.toString())
    } else
        N = localStorage.getItem("leiaKey"),
        N && function(e) {
            try {
                return function(e) {
                    try {
                        const t = e.split(".")[1]
                          , n = JSON.parse(atob(t));
                        if (n && n.exp) {
                            const e = 1e3 * n.exp;
                            return Date.now() > e
                        }
                        return !0
                    } catch (e) {
                        return console.error("Error decoding token:", e),
                        localStorage.removeItem("leiaKey"),
                        !0
                    }
                }(atob(e))
            } catch (e) {
                return console.error("Error decoding key:", e),
                !0
            }
        }(N) && (console.log("Stored key is expired, removing"),
        localStorage.removeItem("leiaKey"),
        N = null);
    if (m) {
        let e = !1;
        m.addEventListener("click", ( () => {
            m.classList.toggle("active"),
            u.style.display = "grid" === u.style.display ? "none" : "grid",
            e || "grid" !== u.style.display || (e = !0,
            document.querySelectorAll(".video-placeholder").forEach((e => {
                const t = e.dataset.videoId;
                if (!t)
                    return;
                const n = document.createElement("iframe");
                n.src = `https://www.youtube.com/embed/${t}`,
                n.title = "YouTube video player",
                n.frameBorder = "0",
                n.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                n.referrerPolicy = "strict-origin-when-cross-origin",
                n.allowFullscreen = !0,
                e.parentNode.replaceChild(n, e)
            }
            )))
        }
        ))
    }
    async function P(t) {
        R(e, "Carregando atividades...", "info"),
        e.style.display = "block";
        try {
            M = null;
            const n = await fetch(`/api/leia-data?key=${encodeURIComponent(t)}`)
              , o = await n.json();
            if (!o.success)
                throw localStorage.removeItem("leiaKey"),
                new Error(o.message || "Erro ao carregar atividades");
            return x = o.token,
            C = o.readerId,
            await async function(e) {
                if (!(e && e.data && e.data.me && e.data.me.reader && e.data.me.reader.listAppliedActivities))
                    return;
                const t = e.data.me.reader.listAppliedActivities
                  , n = t.map((e => {
                    const t = e.books && e.books.length > 0 ? e.books[0] : null
                      , n = t ? t.image_url_thumb : null;
                    return n ? O(n) : Promise.resolve(null)
                }
                ));
                await Promise.all(n)
            }(o.assignments),
            $ = {
                assignments: o.assignments,
                searchBookV3: o.searchBookV3
            },
            V(o.assignments, o.searchBookV3),
            e.style.display = "none",
            o
        } catch (t) {
            throw R(e, `Erro: ${t.message}`, "error"),
            t
        }
    }
    function O(e) {
        return e ? I[e] ? Promise.resolve(e) : new Promise((t => {
            const n = new Image;
            n.onload = () => {
                I[e] = !0,
                t(e)
            }
            ,
            n.onerror = () => {
                I[e] = !1,
                t(null)
            }
            ,
            n.src = e
        }
        )) : Promise.resolve(null)
    }
    function V(e, n) {
        if (t.innerHTML = "",
        !(e && e.data && e.data.me && e.data.me.reader && e.data.me.reader.listAppliedActivities))
            return void (t.innerHTML = '<div class="error-message">Nenhuma atividade encontrada ou formato de dados inválido.</div>');
        const o = e.data.me.reader.listAppliedActivities;
        if (0 === o.length)
            return;
        (T ? o.filter((e => {
            const t = e.appliedActivity && e.appliedActivity.appliedActivityAnswer ? e.appliedActivity.appliedActivityAnswer.status : "UNKNOWN";
            return "CORRECTED" !== t && "DONE" !== t
        }
        )) : o).forEach((e => {
            const n = e.books && e.books.length > 0 ? e.books[0] : null
              , o = e.appliedActivity && e.appliedActivity.appliedActivityAnswer ? e.appliedActivity.appliedActivityAnswer.status : "AVAILABLE"
              , a = document.createElement("div");
            a.className = "assignment-card fade-in";
            const s = n && n.image_url_thumb ? n.image_url_thumb : null;
            a.innerHTML = `\n                <div class="book-cover-container" style="height: 180px; background-color: #242424;">\n                    <div class="book-cover-placeholder">\n                        <div class="spinner"></div>\n                    </div>\n                    ${s ? `<img src="${s}" alt="Book cover" width="100%" height="180" class="book-cover loading" \n                        onload="this.classList.remove('loading')" \n                        onerror="this.src='placeholder.jpg'; this.classList.remove('loading')">` : '<img src="placeholder.jpg" alt="Book cover" width="100%" height="180" class="book-cover">'}\n                </div>\n                <div class="assignment-info">\n                    <h3 class="assignment-title">${n.name}</h3>\n                    ${n ? `\n                        <p class="book-author">${n.author || "Autor desconhecido"}</p>\n                    ` : ""}\n                    <span class="assignment-status status-${o.toLowerCase()}">${q(o)}</span>\n                </div>\n            `,
            a.addEventListener("click", ( () => {
                j(e, "assignment")
            }
            )),
            t.appendChild(a)
        }
        )),
        n && n.length > 0 && n.forEach((e => {
            const n = document.createElement("div");
            n.className = "assignment-card fade-in";
            const o = e && e.imageUrlThumb ? e.imageUrlThumb : null;
            n.innerHTML = `\n                    <div class="book-cover-container" style="height: 180px; background-color: #242424;">\n                        <div class="book-cover-placeholder">\n                            <div class="spinner"></div>\n                        </div>\n                        ${o ? `<img src="${o}" alt="Book cover" width="100%" height="180" class="book-cover loading" \n                            onload="this.classList.remove('loading')" \n                            onerror="this.src='placeholder.jpg'; this.classList.remove('loading')">` : '<img src="placeholder.jpg" alt="Book cover" width="100%" height="180" class="book-cover">'}\n                    </div>\n                    <div class="assignment-info">\n                        <h3 class="assignment-title">${e.name}</h3>\n                        ${e ? `\n                            <p class="book-author">${e.author || "Autor desconhecido"}</p>\n                        ` : ""}\n                    </div>\n                `,
            n.addEventListener("click", ( () => {
                j(e, "searchBookV3")
            }
            )),
            t.appendChild(n)
        }
        ))
    }
    function j(e, t) {
        let n, s;
        S = e,
        S.shownPrompt = !1,
        S.type = t,
        "assignment" === t ? (n = e.books && e.books.length > 0 ? e.books[0] : null,
        s = e.appliedActivity && e.appliedActivity.appliedActivityAnswer ? e.appliedActivity.appliedActivityAnswer.status : "AVAILABLE") : "searchBookV3" === t && (n = e,
        s = "AVAILABLE"),
        i.textContent = n ? n.name || "Sem título" : e.title || "Detalhes da Atividade";
        const d = n && n.image_url_thumb ? n.image_url_thumb : n.imageUrlThumb;
        r.innerHTML = "";
        const c = document.createElement("div");
        if (c.className = "book-info",
        n) {
            const e = document.createElement("div");
            e.className = "modal-book-cover-container";
            const t = document.createElement("div");
            t.className = "modal-book-cover-placeholder",
            t.innerHTML = '<div class="spinner"></div>',
            e.appendChild(t);
            const o = document.createElement("img");
            o.alt = n.name || "Capa do livro",
            o.className = "modal-book-cover",
            o.style.opacity = "0",
            o.onload = function() {
                o.style.opacity = "1",
                t.style.display = "none"
            }
            ,
            o.onerror = function() {
                o.src = "placeholder.jpg",
                o.style.opacity = "1",
                t.style.display = "none"
            }
            ,
            o.src = d || "placeholder.jpg",
            o.complete && o.onload(),
            e.appendChild(o),
            c.appendChild(e);
            const a = document.createElement("div");
            a.className = "book-details";
            const s = document.createElement("p");
            if (s.innerHTML = `<strong>Autor:</strong> ${n.author || "Autor desconhecido"}`,
            a.appendChild(s),
            n.degree) {
                const e = document.createElement("p");
                e.innerHTML = `<strong>Série/Ano:</strong> ${n.degree}`,
                a.appendChild(e)
            }
            c.appendChild(a)
        } else
            c.innerHTML = "<p>Nenhum livro associado a esta atividade.</p>";
        const m = document.createElement("div");
        m.className = "activity-details";
        const u = document.createElement("p");
        u.innerHTML = `<strong>Status:</strong> <span class="status-badge status-${s.toLowerCase()}">${q(s)}</span>`,
        m.appendChild(u),
        r.appendChild(c),
        r.appendChild(m),
        l.style.display = "DOING" === s || "AVAILABLE" === s ? "block" : "none",
        document.body.style.overflow = "hidden",
        a.style.display = "block",
        o.style.display = "block"
    }
    function D() {
        v && h ? (document.body.style.overflow = "",
        v.style.display = "none",
        h.style.display = "none") : console.error("Cannot close search modal - elements not found")
    }
    async function H() {
        const t = b.value.trim();
        if (t) {
            M = t,
            k.disabled = !0,
            k.classList.add("loading");
            try {
                D(),
                R(e, "Buscando livros...", "info"),
                e.style.display = "block";
                const n = await fetch(`/api/leia-data?key=${encodeURIComponent(N)}&q=${encodeURIComponent(t)}`)
                  , o = await n.json();
                if (!o.success)
                    throw new Error(o.message || "Erro ao buscar livros");
                if (o.searchBookV3 && o.searchBookV3.length > 0 && await async function(e) {
                    if (!e || !Array.isArray(e))
                        return;
                    const t = e.map((e => {
                        const t = e ? e.imageUrlThumb : null;
                        return t ? O(t) : Promise.resolve(null)
                    }
                    ));
                    await Promise.all(t)
                }(o.searchBookV3),
                o.searchBookV3 && 0 !== o.searchBookV3.length)
                    if ($) {
                        const e = {
                            assignments: $.assignments,
                            searchBookV3: o.searchBookV3
                        };
                        $ = e,
                        T = !0,
                        g.checked = !0,
                        V(e.assignments, e.searchBookV3)
                    } else
                        V(null, o.searchBookV3);
                else
                    K("Busca", "Nenhum livro encontrado. Tente outra busca.");
                e.style.display = "none"
            } catch (t) {
                R(e, `Erro: ${t.message}`, "error"),
                D()
            } finally {
                k.disabled = !1,
                k.classList.remove("loading")
            }
        } else
            b.focus()
    }
    function _() {
        document.body.style.overflow = "",
        a.style.display = "none",
        o.style.display = "none"
    }
    function U() {
        document.body.style.overflow = "",
        E.style.display = "none"
    }
    function R(e, t, n) {
        e.textContent = t,
        e.className = "status-message",
        e.classList.add(`status-${n}`),
        e.style.display = "block"
    }
    function K(e, t) {
        w.textContent = e,
        L.textContent = t,
        document.body.style.overflow = "hidden",
        E.style.display = "block"
    }
    function q(e) {
        switch (e) {
        case "DOING":
            return "Pendente";
        case "CORRECTED":
        case "DONE":
            return "Concluído";
        case "AVAILABLE":
            return "Disponível";
        default:
            return "Desconhecido"
        }
    }
    p && p.addEventListener("click", ( () => {
        N && (p.classList.add("loading"),
        p.disabled = !0,
        b && (b.value = "",
        M = null,
        T = !1,
        g.checked = !1),
        P(N).finally(( () => {
            p.classList.remove("loading"),
            p.disabled = !1
        }
        )))
    }
    )),
    y ? (console.log("Adding click event listener to search button"),
    y.addEventListener("click", ( () => {
        console.log("Search button clicked"),
        function() {
            if (console.log("Opening search modal", {
                searchModalOverlay: v,
                searchModal: h
            }),
            !v || !h)
                return void console.error("Search modal elements not found");
            document.body.style.overflow = "hidden",
            v.style.display = "block",
            h.style.display = "block",
            b && (b.focus(),
            b.value = "")
        }()
    }
    ))) : console.log("Search button not found in DOM"),
    f && f.addEventListener("click", ( () => {
        D()
    }
    )),
    v && v.addEventListener("click", (e => {
        e.target === v && D()
    }
    )),
    k && b && (k.addEventListener("click", ( () => {
        H()
    }
    )),
    b.addEventListener("keypress", (e => {
        "Enter" === e.key && H()
    }
    ))),
    N ? (n.style.display = "block",
    c && (c.style.display = "none"),
    m && (m.style.display = "none"),
    u && (u.style.display = "none"),
    P(N)) : (n.style.display = "none",
    c && (c.style.display = "block"),
    m && (m.style.display = "flex"),
    u && (u.style.display = "none"),
    p && (p.style.display = "none")),
    s.addEventListener("click", ( () => {
        _()
    }
    )),
    a.addEventListener("click", (e => {
        e.target === a && _()
    }
    )),
    A && A.addEventListener("click", U),
    B && B.addEventListener("click", U),
    E && E.addEventListener("click", (e => {
        e.target === E && U()
    }
    )),
    l.addEventListener("click", (async () => {
        if (S && x && C) {
            l.disabled = !0,
            l.textContent = "Processando...",
            l.classList.add("loading");
            try {
                const e = await fetch("/api/leia-complete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token: x,
                        readerId: C,
                        activityId: S?.activityId || S.slug,
                        slug: S?.slug || S.books[0].slug,
                        appliedActivity: S?.appliedActivity,
                        type: S.type
                    })
                })
                  , t = await e.json();
                if (!t.success)
                    throw new Error(t.message || "Falha ao completar atividade");
                K("Sucesso", 'Atividade completada com sucesso! Se ele for exibido como "pendente", você precisará enviar o exame manualmente.'),
                _(),
                M ? H() : P(N)
            } catch (e) {
                K("Erro", e.message)
            } finally {
                l.disabled = !1,
                l.textContent = "Completar Automaticamente",
                l.classList.remove("loading")
            }
        } else
            K("Erro", "Dados da atividade ou autorização inválidos.")
    }
    )),
    d.addEventListener("click", (async () => {
        if (S && x && C) {
            d.disabled = !0,
            d.textContent = "Processando...",
            d.classList.add("loading");
            try {
                const e = await fetch(`https://livros.arvore.com.br/leitor/api_mobile/book/${S?.slug || S.books[0].slug}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${x}`
                    }
                });
                if ((await e.json()).legacy_percentage > .9 && !S.shownPrompt)
                    return S.shownPrompt = !0,
                    d.disabled = !1,
                    d.textContent = "Ler",
                    d.classList.remove("loading"),
                    void K("Erro", 'Este livro já foi lido em sua maior parte. Se você tem certeza de que ainda deseja ler, clique em "Ler" novamente.');
                const t = await fetch("/api/leia-read", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token: x,
                        readerId: C,
                        slug: S?.slug || S.books[0].slug
                    })
                })
                  , n = await t.json();
                if (!n.success || !n.statusId)
                    throw new Error(n.message || "Falha ao iniciar leitura da atividade");
                K("Progresso", "Iniciando leitura do livro..."),
                U(),
                function(e) {
                    let t;
                    const n = document.createElement("div");
                    n.className = "read-status-indicator",
                    n.innerHTML = '\n            <style>\n                .read-status-indicator {\n                    margin-top: 15px;\n                    padding: 10px;\n                    background-color: #2a2a2a;\n                    border-radius: 6px;\n                }\n                .read-progress-container {\n                    display: flex;\n                    flex-direction: column;\n                    gap: 8px;\n                }\n                .read-progress-text {\n                    font-size: 14px;\n                    text-align: center;\n                }\n                .read-progress-bar {\n                    height: 8px;\n                    background: #444;\n                    border-radius: 4px;\n                    overflow: hidden;\n                }\n                .read-progress-fill {\n                    height: 100%;\n                    background: #4caf50;\n                    width: 0%;\n                    transition: width 0.5s ease;\n                    border-radius: 4px;\n                }\n            </style>\n            <div class="read-progress-container">\n                <div class="read-progress-text">Lendo 0 de ? páginas</div>\n                <div class="read-progress-bar">\n                    <div class="read-progress-fill" style="width: 0%"></div>\n                </div>\n            </div>\n        ',
                    r.appendChild(n),
                    t = setInterval((async () => {
                        try {
                            const o = await fetch(`/api/leia-status/${e}`)
                              , a = await o.json();
                            if (!a.status)
                                throw clearInterval(t),
                                new Error(a.message || "Falha ao verificar status da leitura");
                            if (a.currentPage > 0) {
                                const e = Math.min(100, Math.round(a.currentPage / a.maxPages * 100));
                                n.innerHTML = `\n                        <style>\n                            .read-status-indicator {\n                                margin-top: 15px;\n                                padding: 10px;\n                                background-color: #2a2a2a;\n                                border-radius: 6px;\n                            }\n                            .read-progress-container {\n                                display: flex;\n                                flex-direction: column;\n                                gap: 8px;\n                            }\n                            .read-progress-text {\n                                font-size: 14px;\n                                text-align: center;\n                            }\n                            .read-progress-bar {\n                                height: 8px;\n                                background: #444;\n                                border-radius: 4px;\n                                overflow: hidden;\n                            }\n                            .read-progress-fill {\n                                height: 100%;\n                                background: #4caf50;\n                                width: 0%;\n                                transition: width 0.5s ease;\n                                border-radius: 4px;\n                            }\n                        </style>\n                        <div class="read-progress-container">\n                            <div class="read-progress-text">Lendo ${a.currentPage} de ${a.maxPages} páginas (${e}%)</div>\n                            <div class="read-progress-bar">\n                                <div class="read-progress-fill" style="width: ${e}%"></div>\n                            </div>\n                        </div>\n                    `
                            }
                            "error" === a.status ? (clearInterval(t),
                            n.remove(),
                            K("Erro", "Falha na leitura do livro. Tente novamente."),
                            d.disabled = !1,
                            d.textContent = "Ler",
                            d.classList.remove("loading")) : "finished" === a.status && (clearInterval(t),
                            n.remove(),
                            K("Sucesso", "Leitura concluída com sucesso!"),
                            _(),
                            M ? H() : P(N),
                            d.disabled = !1,
                            d.textContent = "Ler",
                            d.classList.remove("loading"))
                        } catch (e) {
                            clearInterval(t),
                            n.remove(),
                            K("Erro", e.message),
                            d.disabled = !1,
                            d.textContent = "Ler",
                            d.classList.remove("loading")
                        }
                    }
                    ), 1e3)
                }(n.statusId)
            } catch (e) {
                K("Erro", e.message),
                d.disabled = !1,
                d.textContent = "Ler",
                d.classList.remove("loading")
            }
        } else
            K("Erro", "Dados da atividade ou autorização inválidos.")
    }
    )),
    document.addEventListener("keydown", (e => {
        "Escape" === e.key && (_(),
        D())
    }
    ))
}
document.addEventListener("DOMContentLoaded", (function() {
    try {
        e()
    } catch (e) {
        localStorage.removeItem("leiaKey")
    }
}
));
