# Dynamic Markdown Blog Server

A local Python web application blog powered by Flask. It dynamically compiles raw Markdown files (`.md`) from a local folder directory into responsive HTML templates using an inline parsing parser, completely bypassing frontend JS dependencies.

## Installation & Running
1. Install Flask package:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the local server engine:
   ```bash
   python app.py
   ```
   *The server runs locally on `http://localhost:8080`.*

## Adding New Articles
To publish a new article:
1. Create a new `.md` file inside the `posts/` folder.
2. Structure the file with a YAML metadata header at the very top:
   ```yaml
   ---
   title: My Article Title
   date: 2026-06-05
   tags: Python, Web
   description: Summary description of the post details.
   ---
   # My Article Title
   Write standard markdown contents here...
   ```

## Features
- **Dynamic Search & Filtering**: Index articles by tags or search phrases.
- **Reading Time Counter**: Estimates minutes required based on content word count.
- **Pure Server Rendering**: Lightweight HTML layout with CSS variables, zero frontend JS logic.
