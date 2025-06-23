import React from 'react';
import {
    Button,
    OverlayTrigger,
    Popover,
} from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

const statuses = ['cumple', 'media','incumple'];

interface FilterPopoverProps {
    columnFilters: any[];
    setColumnFilters: (filters: any[]) => void;
}

interface StatusItemProps {
    status: string;
    columnFilters: any[];
    setColumnFilters: (filters: any[]) => void;
}

const StatusItem: React.FC<StatusItemProps> = ({ status, columnFilters, setColumnFilters }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleClick = () => {
        const newFilters = columnFilters.filter(f => f.id !== 'complete');
        let value;
        if (status === "cumple") {
            value = "true";
        } else if (status === "media") {
            value = "avg";
        } else {
            value = "false";
        }
        const updatedFilters = [...newFilters, { id: 'totalScore', value: value }];
        setColumnFilters(updatedFilters);

        const updatedParams: Record<string, string> = {};
        updatedFilters.forEach(({ id, value }) => {
            if (value !== undefined && value !== '') updatedParams[id] = String(value);
        });
        setSearchParams(updatedParams);
    };

    let badgeClass = '';
    let label = '';

    if (status === 'cumple') {
        badgeClass = 'completeBadgeFilter';
        label = 'Cumple';
    } else if (status === 'incumple') {
        badgeClass = 'incompleteBadgeFilter';
        label = 'Incumple';
    } else if (status === 'media') {
        badgeClass = 'halfCompleteBadgeFilter';
        label = 'Cumple Media';
    }

    return (
        <span
            className={badgeClass}
            style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={handleClick}
        >
            {label}
        </span>
    );
};

const NameFilterPopover: React.FC<FilterPopoverProps> = ({ columnFilters, setColumnFilters }) => {
    const popover = (
        <Popover id="popover-status-filter" style={{ minWidth: '10rem' }}>
            <Popover.Header as="h3">Estado</Popover.Header>
            <Popover.Body>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {statuses.map((status) => (
                        <StatusItem
                            key={status}
                            status={status}
                            columnFilters={columnFilters}
                            setColumnFilters={setColumnFilters}
                        />
                    ))}
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger="click" placement="left" overlay={popover} rootClose>
            <Button variant="light" style={{ border: '1px solid' }}>
                <i className="bi bi-funnel" />
            </Button>
        </OverlayTrigger>
    );
};

export default NameFilterPopover;
