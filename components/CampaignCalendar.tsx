import React, { useState, useMemo, useCallback } from 'react';
import type { CalendarItem, CampaignStatus } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from './icons/Icons';

// --- Helper Functions & Constants ---

const STATUS_STYLES: Record<CampaignStatus, { bg: string; text: string; label: string }> = {
    draft: { bg: 'bg-gray-600', text: 'text-gray-200', label: 'Draft' },
    review: { bg: 'bg-blue-600', text: 'text-blue-100', label: 'In Review' },
    approved: { bg: 'bg-green-600', text: 'text-green-100', label: 'Approved' },
    published: { bg: 'bg-purple-600', text: 'text-purple-100', label: 'Published' },
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_MAP: Record<string, number> = { 'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6 };


const processInitialItems = (items: Omit<CalendarItem, 'id' | 'status' | 'date'>[]): CalendarItem[] => {
    const scheduledItems: CalendarItem[] = [];
    
    // Find the earliest date to anchor the calendar, starting from today
    let anchorDate = new Date();
    anchorDate.setHours(0, 0, 0, 0); // Normalize to start of day

    for (const rawItem of items) {
        const weekNumber = parseInt(rawItem.week.replace('Week ', ''), 10);
        const targetDay = DAY_MAP[rawItem.day.toLowerCase()];

        if (isNaN(weekNumber) || targetDay === undefined) continue;

        // Calculate the date for the item based on a consistent start
        let itemDate = new Date(anchorDate);
        const weekOffset = (weekNumber - 1);
        
        // Set to the Monday of the target week relative to the anchor week's Monday
        let currentDay = itemDate.getDay();
        let distance = 1 - currentDay + (currentDay === 0 ? -6 : 0); // distance to Monday
        itemDate.setDate(itemDate.getDate() + distance + (weekOffset * 7));

        // Now move to the target day within that week
        let finalDistance = targetDay - itemDate.getDay();
        itemDate.setDate(itemDate.getDate() + finalDistance);
        
        scheduledItems.push({
            ...rawItem,
            id: `item-${scheduledItems.length}-${Date.now()}`,
            status: 'draft',
            date: itemDate,
        });
    }
    return scheduledItems;
};

// --- Modal Component ---

interface DetailModalProps {
    item: CalendarItem;
    onClose: () => void;
    onUpdate: (item: CalendarItem) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ item, onClose, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(item.content);
    const [editedStatus, setEditedStatus] = useState<CampaignStatus>(item.status);
    const [copyButtonText, setCopyButtonText] = useState('Copy Content');

    const handleSave = () => {
        onUpdate({ ...item, content: editedContent, status: editedStatus });
        setIsEditing(false);
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(item.content).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy Content'), 2000);
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700 p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-indigo-400">{item.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{item.platform} | {item.date?.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon/></button>
                </div>
                <div className="mt-4 border-t border-gray-700 pt-4">
                    {isEditing ? (
                        <textarea
                            value={editedContent}
                            onChange={e => setEditedContent(e.target.value)}
                            className="w-full h-48 bg-gray-900 border border-gray-600 rounded-md p-2 text-sm text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    ) : (
                        <p className="text-sm text-gray-300 whitespace-pre-wrap max-h-64 overflow-y-auto">{item.content}</p>
                    )}
                </div>
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                     <div>
                        <label htmlFor="status" className="text-sm font-medium text-gray-400 mr-2">Status:</label>
                        <select
                            id="status"
                            value={isEditing ? editedStatus : item.status}
                            onChange={e => setEditedStatus(e.target.value as CampaignStatus)}
                            disabled={!isEditing}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2 disabled:opacity-70"
                        >
                            {Object.entries(STATUS_STYLES).map(([status, { label }]) => (
                                <option key={status} value={status}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        {isEditing ? (
                             <>
                                <button onClick={() => setIsEditing(false)} className="text-xs font-medium text-gray-400 hover:text-white px-4 py-2 rounded-md">Cancel</button>
                                <button onClick={handleSave} className="text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">Save Changes</button>
                            </>
                        ) : (
                             <>
                                <button onClick={() => setIsEditing(true)} className="text-xs font-medium text-gray-400 hover:text-white px-4 py-2 rounded-md">Edit</button>
                                <button onClick={handleCopy} className="text-xs font-medium bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md">{copyButtonText}</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Calendar Component ---

interface CampaignCalendarProps {
    initialItems: Omit<CalendarItem, 'id' | 'status' | 'date'>[];
}

export const CampaignCalendar: React.FC<CampaignCalendarProps> = ({ initialItems }) => {
    const [items, setItems] = useState<CalendarItem[]>(() => processInitialItems(initialItems));
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);

    const handleUpdateItem = useCallback((updatedItem: CalendarItem) => {
        setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
    }, []);

    const { monthGrid, firstDayOfMonth } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const grid: Date[] = [];
        // Days from previous month to fill the grid
        for (let i = firstDayOfMonth.getDay(); i > 0; i--) {
            grid.push(new Date(year, month, 1 - i));
        }
        // Days of current month
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            grid.push(new Date(year, month, i));
        }
        // Days from next month to fill the grid
        const remainingCells = 42 - grid.length; // 6 rows * 7 days
        for (let i = 1; i <= remainingCells; i++) {
            grid.push(new Date(year, month + 1, i));
        }
        return { monthGrid: grid, firstDayOfMonth };
    }, [currentDate]);
    
    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };
    
    return (
        <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg border border-gray-700">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                    {firstDayOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex space-x-2">
                    <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-gray-700"><ChevronLeftIcon /></button>
                    <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-gray-700"><ChevronRightIcon /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {DAY_NAMES.map(day => <div key={day} className="text-center text-xs font-bold text-gray-400 py-2">{day}</div>)}

                {monthGrid.map((day, index) => {
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isToday = new Date().toDateString() === day.toDateString();
                    const dayItems = items.filter(item => item.date?.toDateString() === day.toDateString());

                    return (
                        <div key={index} className={`h-28 sm:h-32 p-1.5 border border-gray-700/50 rounded-sm ${isCurrentMonth ? 'bg-gray-800' : 'bg-gray-900/50'}`}>
                            <span className={`text-xs ${isToday ? 'bg-indigo-600 text-white rounded-full flex items-center justify-center h-5 w-5' : isCurrentMonth ? 'text-gray-200' : 'text-gray-500'}`}>
                                {day.getDate()}
                            </span>
                            <div className="mt-1 space-y-1 overflow-y-auto max-h-[calc(100%-1.5rem)]">
                                {dayItems.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedItem(item)}
                                        className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer ${STATUS_STYLES[item.status].bg} ${STATUS_STYLES[item.status].text} hover:opacity-80 transition-opacity`}
                                    >
                                        {item.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
            {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} onUpdate={handleUpdateItem} />}
        </div>
    );
};