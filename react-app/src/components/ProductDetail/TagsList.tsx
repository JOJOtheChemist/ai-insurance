import React from 'react';

interface TagsListProps {
    tags: string[];
}

const TagsList: React.FC<TagsListProps> = ({ tags }) => {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
                <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md text-sm"
                >
                    #{tag}
                </span>
            ))}
        </div>
    );
};

export default TagsList;
