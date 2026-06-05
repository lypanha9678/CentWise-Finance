from flask import Flask, render_template, request, abort
import os
import re

app = Flask(__name__)
POSTS_DIR = 'posts'

def parse_markdown_to_html(md_content):
    # Strip front matter
    if md_content.startswith('---'):
        parts = md_content.split('---', 2)
        if len(parts) >= 3:
            md_content = parts[2]
            
    html = md_content.strip()
    
    # Headers
    html = re.sub(r'^#\s+(.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    html = re.sub(r'^##\s+(.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^###\s+(.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    
    # Bold / Strong
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    
    # Inline code
    html = re.sub(r'`(.+?)`', r'<code>\1</code>', html)
    
    # Lists
    html = re.sub(r'^\-\s+(.+)$', r'<li>\1</li>', html, flags=re.MULTILINE)
    # Wrap contiguous list items in <ul>
    html = re.sub(r'(<li>.*?</li>)+', r'<ul>\g<0></ul>', html, flags=re.DOTALL)
    
    # Replace remaining empty line breaks with paragraph tags
    paragraphs = []
    for block in html.split('\n\n'):
        block = block.strip()
        if block:
            if not block.startswith(('<h1', '<h2', '<h3', '<ul', '<li')):
                paragraphs.append(f"<p>{block.replace(chr(10), '<br>')}</p>")
            else:
                paragraphs.append(block)
    return '\n'.join(paragraphs)

def load_posts():
    posts = []
    if not os.path.exists(POSTS_DIR):
        return []
        
    for filename in os.listdir(POSTS_DIR):
        if filename.endswith('.md'):
            filepath = os.path.join(POSTS_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Parse Front Matter
            meta = {}
            if content.startswith('---'):
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    header_lines = parts[1].strip().split('\n')
                    for line in header_lines:
                        if ':' in line:
                            k, v = line.split(':', 1)
                            meta[k.strip()] = v.strip()
            
            slug = filename[:-3] # Strip .md
            reading_time = max(1, round(len(content.split()) / 200)) # Approx 200 words per minute
            
            posts.append({
                'slug': slug,
                'title': meta.get('title', slug.replace('_', ' ').title()),
                'date': meta.get('date', 'Unknown Date'),
                'tags': [t.strip() for t in meta.get('tags', 'General').split(',')],
                'description': meta.get('description', 'Read full article...'),
                'content': content,
                'reading_time': reading_time
            })
    return sorted(posts, key=lambda x: x['date'], reverse=True)

@app.route('/')
def index():
    posts = load_posts()
    search = request.args.get('search', '').strip()
    tag = request.args.get('tag', '').strip()
    
    if search:
        posts = [p for p in posts if search.lower() in p['title'].lower() or search.lower() in p['content'].lower()]
    if tag:
        posts = [p for p in posts if tag.lower() in [t.lower() for t in p['tags']]]
        
    return render_template('index.html', posts=posts, search=search, active_tag=tag)

@app.route('/post/<slug>')
def post(slug):
    posts = load_posts()
    matched = next((p for p in posts if p['slug'] == slug), None)
    
    if not matched:
        abort(404)
        
    html_content = parse_markdown_to_html(matched['content'])
    return render_template('post.html', post=matched, html_content=html_content)

if __name__ == '__main__':
    app.run(debug=True, port=8080)
