import '../styles/SkeletonLoader.css';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
    const renderSkeleton = (index) => {
        switch (type) {
            case 'card':
                return (
                    <div key={index} className="skeleton-card">
                        <div className="skeleton-img pulse"></div>
                        <div className="skeleton-content">
                            <div className="skeleton-badge pulse"></div>
                            <div className="skeleton-title pulse"></div>
                            <div className="skeleton-text pulse"></div>
                            <div className="skeleton-price pulse"></div>
                            <div className="skeleton-btn pulse"></div>
                        </div>
                    </div>
                );
            case 'text':
                return <div key={index} className="skeleton-text pulse"></div>;
            case 'title':
                return <div key={index} className="skeleton-title pulse"></div>;
            case 'avatar':
                return <div key={index} className="skeleton-avatar pulse"></div>;
            default:
                return <div key={index} className="skeleton-default pulse"></div>;
        }
    };

    return (
        <>
            {Array(count)
                .fill(0)
                .map((_, i) => renderSkeleton(i))}
        </>
    );
}
