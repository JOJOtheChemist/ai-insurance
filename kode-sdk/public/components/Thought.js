/**
 * Thought Component
 * Renders the internal thought process of the agent.
 */
class ThoughtComponent {
    constructor(container) {
        this.container = container;
    }

    render(thoughtText) {
        if (!thoughtText) return;

        const div = document.createElement('div');
        div.className = 'thought-bubble';
        div.style.display = 'block';
        div.innerHTML = `<strong>🧠 思考过程:</strong> ${thoughtText}`;

        this.container.appendChild(div);
        this.scrollToBottom();
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.container.scrollTop = this.container.scrollHeight;
        });
    }
}
