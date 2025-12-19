/**
 * SmartCard Component
 * Renders rich content cards like Analysis or Pitch cards.
 */
class SmartCardComponent {
    constructor(container) {
        this.container = container;
    }

    render(cardData) {
        if (!cardData) return;

        const cardDiv = document.createElement('div');
        cardDiv.className = 'smart-card';

        // 1. Tags
        let tagsHtml = '';
        if (cardData.content.tags) {
            tagsHtml += cardData.content.tags.map(t => `<span class="tag">${t}</span>`).join('');
        }
        if (cardData.highlight_tags) {
            tagsHtml += cardData.highlight_tags.map(t => `<span class="tag">${t}</span>`).join('');
        }

        // 2. Content
        let contentHtml = '';
        if (typeof cardData.content === 'string') {
            contentHtml = `<p>${cardData.content}</p>`;
        } else {
            // Specific parsing for known types
            if (cardData.content.risk_gap) {
                contentHtml += `<p><strong>⚠ 风险缺口:</strong> ${cardData.content.risk_gap}</p>`;
            }
            if (cardData.content.budget_analysis) {
                contentHtml += `<p><strong>💰 预算分析:</strong> ${cardData.content.budget_analysis}</p>`;
            }
            // Generic fallback for other keys
            Object.keys(cardData.content).forEach(key => {
                if (!['risk_gap', 'budget_analysis', 'tags'].includes(key)) {
                    contentHtml += `<p><strong>${key}:</strong> ${cardData.content[key]}</p>`;
                }
            });
        }

        cardDiv.innerHTML = `
            <div class="card-title">
                ${cardData.title} 
                <span class="card-badge">${cardData.type === 'analysis_card' ? '分析' : '话术'}</span>
            </div>
            <div class="card-content">
                ${contentHtml}
            </div>
            <div class="card-tags">
                ${tagsHtml}
            </div>
        `;

        this.container.appendChild(cardDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.container.scrollTop = this.container.scrollHeight;
        });
    }
}
