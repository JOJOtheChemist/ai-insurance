/**
 * Suggestions Component
 * Renders interactive buttons from quick replies and follow-up prompts.
 * 
 * - Quick Replies: Vertical list options (Choice-like)
 * - Follow-up Prompts: Horizontal scroll pills (Topic-like)
 */
class SuggestionsComponent {
    constructor(container, sendCallback) {
        this.container = container;
        this.sendCallback = sendCallback;
    }

    render(uiSuggestions) {
        if (!uiSuggestions) return;

        // 1. Quick Replies (Vertical Choice Options)
        if (uiSuggestions.quick_replies && Array.isArray(uiSuggestions.quick_replies) && uiSuggestions.quick_replies.length > 0) {
            this._renderQuickReplies(uiSuggestions.quick_replies);
        }

        // 2. Follow-up Prompts (Horizontal Pills)
        if (uiSuggestions.follow_up_prompts && Array.isArray(uiSuggestions.follow_up_prompts) && uiSuggestions.follow_up_prompts.length > 0) {
            this._renderFollowUp(uiSuggestions.follow_up_prompts);
        }

        this.scrollToBottom();
    }

    _renderQuickReplies(replies) {
        const wrapper = document.createElement('div');
        wrapper.className = 'quick-replies-container';

        replies.forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-option';
            btn.textContent = text;
            btn.onclick = () => {
                console.log(`[QuickReply] Clicked: ${text}`);
                if (this.sendCallback) this.sendCallback(text);
            };
            wrapper.appendChild(btn);
        });

        this.container.appendChild(wrapper);
    }

    _renderFollowUp(prompts) {
        const wrapper = document.createElement('div');
        wrapper.className = 'follow-up-container';

        prompts.forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'follow-up-pill';
            btn.textContent = text;
            btn.onclick = () => {
                console.log(`[FollowUp] Clicked: ${text}`);
                if (this.sendCallback) this.sendCallback(text);
            };
            wrapper.appendChild(btn);
        });

        this.container.appendChild(wrapper);
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.container.scrollTop = this.container.scrollHeight;
        });
    }
}
