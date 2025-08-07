import React from 'react';

const getInitials = (name: string): string => {
    const words = name.split(' ').filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const nameToColor = (name: string): string => {
    let hash = 0;
    if (name.length === 0) return '#607d8b';
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    const colors = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7',
        '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
        '#009688', '#4caf50', '#8bc34a', '#cddc39',
        '#ffc107', '#ff9800', '#ff5722',
        '#795548', '#607d8b'
    ];
    const index = Math.abs(hash % colors.length);
    return colors[index];
};


interface MasterAvatarProps {
    name: string;
    avatarUrl: string | null | undefined;
    className?: string;
}

export const MasterAvatar = ({ name, avatarUrl, className = "" }: MasterAvatarProps) => {
    const containerClasses = `flex items-center justify-center rounded-full ${className}`;

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={name}
                className={`${containerClasses} object-cover`}
            />
        );
    }

    const initials = getInitials(name);
    const bgColor = nameToColor(name);

    return (
        <div
            className={containerClasses}
            style={{ backgroundColor: bgColor }}
        >
            <span className="text-white text-4xl font-bold select-none">{initials}</span>
        </div>
    );
};
