/**
 * Message Component
 * Renders standard chat messages for both User and Assistant.
 */
class MessageComponent {
    constructor(container) {
        this.container = container;
    }

    renderUser(text) {
        this._render('user', text);
    }

    renderAssistant(text) {
        this._render('assistant', text);
    }

    renderSystem(text) {
        const div = document.createElement('div');
        div.className = 'message-row assistant';
        div.innerHTML = `<div class="bubble" style="color:red; border:1px solid red; background:#fff0f0">${text}</div>`;
        this.container.appendChild(div);
        this.scrollToBottom();
    }

    _render(role, text) {
        const div = document.createElement('div');
        div.className = `message-row ${role}`;
        div.innerHTML = `<div class="bubble">${this._formatText(text)}</div>`;
        this.container.appendChild(div);
        this.scrollToBottom();
    }

    _formatText(text) {
        // Simple markdown-like replacement for line breaks
        return text ? text.replace(/\n/g, '<br>') : '';
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.container.scrollTop = this.container.scrollHeight;
        });
    }
}
