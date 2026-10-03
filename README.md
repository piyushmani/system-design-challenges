<div align="center">
  
# ⚡ System Design Challenges

**A modern, interactive platform to master system design through real-world engineering scenarios.**

[![Live Demo](https://img.shields.io/badge/View_Live_Site-34d399?style=for-the-badge&logo=github)](https://piyushmani.github.io/system-design-challenges/)

</div>

---

## ✨ Features

- **Scenario-Based Learning:** Every challenge puts you in the shoes of a senior engineer facing a real production issue (latency spikes, replication lag, CAP theorem trade-offs).
- **Deep-Dive Explanations:** Don't just learn the "right" answer. Understand *why* the alternatives fall short.
- **Trade-off Comparisons:** Visual matrices comparing latency, operational complexity, write overhead, and scalability.
- **Real-World Context:** See how tech giants layer multiple solutions in production rather than relying on a single silver bullet.
- **Beautiful UI:** A dense, readable interface with seamless Light / Dark mode support.

## 🚀 How It Works (Site Generator)

This repository serves the highly-optimized static HTML, CSS, and JS to GitHub Pages. However, you don't write HTML by hand! 

Challenges are generated locally using a custom **Incremental Python Build Script** that lives adjacent to this repository.

### Adding a New Challenge

1. **Draft the JSON**
   Paste your new challenge JSON into your local `site_generator/data/new_question.json` file.
   *(Requires fields like: `subject`, `scenario`, `options`, `tradeoff_table`, `common_mistakes`, etc.)*

2. **Run the Generator**
   ```bash
   python3 site_generator/generate_site.py
   ```
   The generator will automatically:
   - Validate your JSON schema.
   - Detect duplicates.
   - Generate a beautiful new `questions/your-slug.html` page.
   - Append the question to the master `questions.json` database.
   - Empty `new_question.json`.
   - Regenerate `index.html` (sorting challenges newest-first).

3. **Deploy to Production**
   Simply commit and push this repository. GitHub Pages will handle the rest!
   ```bash
   git add -A
   git commit -m "add: new system design challenge"
   git push
   ```

*(Need to rebuild everything from scratch? Run `python3 generate_site.py --force`)*

## 🛠 Tech Stack

- **Frontend:** Pure HTML5, CSS3 (CSS Variables for theming), Vanilla JavaScript. Zero dependencies, incredibly fast.
- **Build Tooling:** Custom Python 3 generator with incremental builds.
- **Hosting:** GitHub Pages.

## 📄 License

This project is licensed under the MIT License.
