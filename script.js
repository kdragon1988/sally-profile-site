(function () {
  "use strict";

  var timelineContainer = document.getElementById("timeline-list");
  var projectContainer = document.getElementById("project-list");

  if (projectContainer) {
    fetch("data/projects.json")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load projects.json");
        return res.json();
      })
      .then(function (projects) {
        projects.forEach(function (p) {
          var card = document.createElement("div");
          card.className = "project-card";

          var name = document.createElement("div");
          name.className = "project-name";
          name.textContent = p.name;

          var meta = document.createElement("div");
          meta.className = "project-meta";
          meta.textContent = (p.status || "進行中") + " / " + (p.owner || "SALLY");

          var desc = document.createElement("p");
          desc.className = "project-desc";
          desc.textContent = p.description;

          card.appendChild(name);
          card.appendChild(meta);
          card.appendChild(desc);
          projectContainer.appendChild(card);
        });
      })
      .catch(function (err) {
        projectContainer.innerHTML =
          '<p style="color:var(--muted)">プロジェクト一覧を読み込めませんでした。</p>';
        console.error(err);
      });
  }

  if (!timelineContainer) return;

  fetch("data/updates.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load updates.json");
      return res.json();
    })
    .then(function (entries) {
      // 時系列順（古い → 新しい）
      entries.sort(function (a, b) {
        return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      });

      entries.forEach(function (entry, i) {
        var item = document.createElement("div");
        item.className = "tl-item";
        item.style.animationDelay = i * 0.06 + "s";

        var meta = document.createElement("div");
        meta.className = "tl-meta";

        var date = document.createElement("span");
        date.className = "tl-date";
        date.textContent = entry.date;

        var cat = document.createElement("span");
        cat.className = "tl-tag tl-tag-cat";
        cat.textContent = entry.category || "未分類";

        var type = document.createElement("span");
        type.className = "tl-tag tl-tag-type";
        type.textContent = entry.type || "一般";

        meta.appendChild(date);
        meta.appendChild(cat);
        meta.appendChild(type);

        var title = document.createElement("div");
        title.className = "tl-title";
        title.textContent = entry.title;

        var details = document.createElement("p");
        details.className = "tl-details";
        details.textContent = entry.details;

        item.appendChild(meta);
        item.appendChild(title);
        item.appendChild(details);
        timelineContainer.appendChild(item);
      });
    })
    .catch(function (err) {
      timelineContainer.innerHTML =
        '<p style="color:var(--muted)">タイムラインを読み込めませんでした。</p>';
      console.error(err);
    });
})();
