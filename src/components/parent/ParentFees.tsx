import React from 'react';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';
import { CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ParentFeesProps {
    children: Student[];
}

export const ParentFees: React.FC<ParentFeesProps> = ({ children }) => {
    // In a real app, we would have a 'payments' or 'invoices' collection in DataContext
    // For now, we will mock some payment data based on the student enrollment
    // or just display a static view for the prototype as per the plan.

    // We do have 'payments' and 'enrollments' in DataContext now!
    const { enrollments, payments } = useData();

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6 border-b-4 border-emerald-500">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <CreditCard className="text-emerald-600" />
                    Fee Status & Payments
                </h2>
                <p className="text-gray-500 text-sm">Manage tuition fees and view payment history</p>
            </div>

            {children.map(child => {
                const enrollment = enrollments.find(e =>
                    e.studentName === child.name || e.email === child.email
                ); // simplistic matching for mock data

                // If no enrollment found (e.g. pre-existing mock student), show dummy data
                const totalFee = enrollment?.totalFee || 25000;
                const paidAmount = enrollment?.paidAmount || 15000;
                const pendingAmount = totalFee - paidAmount;
                const paymentStatus = pendingAmount <= 0 ? 'Fully Paid' : 'Partial Due';

                return (
                    <div key={child.id} className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-800">{child.name}</h3>
                                <p className="text-xs text-gray-500">Class {child.classLevel} - Batch {child.batch}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${pendingAmount <= 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {paymentStatus}
                            </span>
                        </div>

                        <div className="p-6">
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                                    <div className="text-sm text-emerald-600 mb-1">Total Fee</div>
                                    <div className="text-2xl font-bold text-emerald-700">₹{totalFee.toLocaleString()}</div>
                                </div>
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                                    <div className="text-sm text-blue-600 mb-1">Paid Amount</div>
                                    <div className="text-2xl font-bold text-blue-700">₹{paidAmount.toLocaleString()}</div>
                                </div>
                                <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
                                    <div className="text-sm text-orange-600 mb-1">Pending Due</div>
                                    <div className="text-2xl font-bold text-orange-700">₹{pendingAmount.toLocaleString()}</div>
                                </div>
                            </div>

                            {pendingAmount > 0 && (
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="text-orange-600 size-5" />
                                        <div>
                                            <p className="font-bold text-orange-800">Payment Due: ₹{pendingAmount.toLocaleString()}</p>
                                            <p className="text-xs text-orange-600">Please clear the dues before the upcoming exams.</p>
                                        </div>
                                    </div>
                                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 font-medium text-sm transition shadow-sm">
                                        Pay Now
                                    </button>
                                </div>
                            )}

                            <div>
                                <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <Clock className="size-4" /> Payment History
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left bg-white border rounded-lg">
                                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                            <tr>
                                                <th className="px-4 py-2 border-b">Date</th>
                                                <th className="px-4 py-2 border-b">Description</th>
                                                <th className="px-4 py-2 border-b">Method</th>
                                                <th className="px-4 py-2 border-b">Transaction ID</th>
                                                <th className="px-4 py-2 border-b">Amount</th>
                                                <th className="px-4 py-2 border-b absolute-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y text-sm">
                                            {/* Mock history since we don't have payments linked to studentId in mock easily yet */}
                                            <tr>
                                                <td className="px-4 py-3">2024-04-10</td>
                                                <td className="px-4 py-3">Admission Fee + Term 1</td>
                                                <td className="px-4 py-3">Online</td>
                                                <td className="px-4 py-3 font-mono text-xs text-gray-500">TXN123456789</td>
                                                <td className="px-4 py-3 font-bold">₹15,000</td>
                                                <td className="px-4 py-3 text-green-600 flex items-center gap-1 font-medium">
                                                    <CheckCircle className="size-3" /> Paid
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
