'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Phone, MapPin, Bike } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface DeliveryPartner {
    id: string;
    name: string;
    phone: string;
    email?: string;
    vehicleType?: string;
    vehicleNumber?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'BUSY';
    currentLocation?: string;
}

export default function DeliveryPartnersPage() {
    const [partners, setPartners] = useState<DeliveryPartner[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<DeliveryPartner | null>(null);
    const [newPartner, setNewPartner] = useState({
        name: '',
        phone: '',
        email: '',
        vehicleType: 'BIKE',
        vehicleNumber: '',
    });
    const [editPartner, setEditPartner] = useState({
        name: '',
        phone: '',
        email: '',
        vehicleType: '',
        vehicleNumber: '',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'BUSY',
    });

    const fetchPartners = async () => {
        try {
            const res = await api.get('/admin/delivery-partners');
            setPartners(res.data);
        } catch (error) {
            console.error('Failed to fetch partners:', error);
            toast.error('Failed to load delivery partners');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleCreatePartner = async () => {
        try {
            await api.post('/admin/delivery-partners', newPartner);
            toast.success('Delivery partner added successfully');
            setIsAddDialogOpen(false);
            setNewPartner({
                name: '',
                phone: '',
                email: '',
                vehicleType: 'BIKE',
                vehicleNumber: '',
            });
            fetchPartners();
        } catch (error) {
            console.error('Failed to create partner:', error);
            toast.error('Failed to create delivery partner');
        }
    };

    const handleOpenEdit = (partner: DeliveryPartner) => {
        setSelectedPartner(partner);
        setEditPartner({
            name: partner.name,
            phone: partner.phone,
            email: partner.email || '',
            vehicleType: partner.vehicleType || '',
            vehicleNumber: partner.vehicleNumber || '',
            status: partner.status,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdatePartner = async () => {
        if (!selectedPartner) return;
        try {
            await api.put(`/admin/delivery-partners/${selectedPartner.id}`, editPartner);
            toast.success('Delivery partner updated successfully');
            setIsEditDialogOpen(false);
            setSelectedPartner(null);
            fetchPartners();
        } catch (error) {
            console.error('Failed to update partner:', error);
            toast.error('Failed to update delivery partner');
        }
    };

    const filteredPartners = partners.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery)
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Delivery Partners</h1>
                    <p className="text-muted-foreground mt-1">Manage your delivery fleet and track their status.</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-orange-600 hover:bg-orange-700">
                            <Plus className="mr-2 h-4 w-4" /> Add Partner
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Delivery Partner</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={newPartner.name}
                                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">Phone</Label>
                                <Input
                                    id="phone"
                                    value={newPartner.phone}
                                    onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    value={newPartner.email}
                                    onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="vehicleType" className="text-right">Vehicle Type</Label>
                                <Input
                                    id="vehicleType"
                                    value={newPartner.vehicleType}
                                    onChange={(e) => setNewPartner({ ...newPartner, vehicleType: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="vehicleNumber" className="text-right">Vehicle No.</Label>
                                <Input
                                    id="vehicleNumber"
                                    value={newPartner.vehicleNumber}
                                    onChange={(e) => setNewPartner({ ...newPartner, vehicleNumber: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreatePartner} className="bg-orange-600 hover:bg-orange-700">Save Partner</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Delivery Partner</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">Name</Label>
                            <Input
                                id="edit-name"
                                value={editPartner.name}
                                onChange={(e) => setEditPartner({ ...editPartner, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-phone" className="text-right">Phone</Label>
                            <Input
                                id="edit-phone"
                                value={editPartner.phone}
                                onChange={(e) => setEditPartner({ ...editPartner, phone: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-email" className="text-right">Email</Label>
                            <Input
                                id="edit-email"
                                value={editPartner.email}
                                onChange={(e) => setEditPartner({ ...editPartner, email: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-vehicleType" className="text-right">Vehicle Type</Label>
                            <Input
                                id="edit-vehicleType"
                                value={editPartner.vehicleType}
                                onChange={(e) => setEditPartner({ ...editPartner, vehicleType: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-vehicleNumber" className="text-right">Vehicle No.</Label>
                            <Input
                                id="edit-vehicleNumber"
                                value={editPartner.vehicleNumber}
                                onChange={(e) => setEditPartner({ ...editPartner, vehicleNumber: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-status" className="text-right">Status</Label>
                            <select
                                id="edit-status"
                                value={editPartner.status}
                                onChange={(e) => setEditPartner({ ...editPartner, status: e.target.value as 'ACTIVE' | 'INACTIVE' | 'BUSY' })}
                                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="BUSY">Busy</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdatePartner} className="bg-orange-600 hover:bg-orange-700">Update Partner</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search partners..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-lg bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Current Location</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">Loading partners...</TableCell>
                            </TableRow>
                        ) : filteredPartners.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No partners found</TableCell>
                            </TableRow>
                        ) : (
                            filteredPartners.map((partner) => (
                                <TableRow key={partner.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                                                {partner.name.charAt(0)}
                                            </div>
                                            {partner.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {partner.phone}</span>
                                            <span className="text-muted-foreground">{partner.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Bike className="h-4 w-4 text-gray-500" />
                                            <span>{partner.vehicleType} - {partner.vehicleNumber}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={partner.status === 'ACTIVE' ? 'default' : partner.status === 'BUSY' ? 'secondary' : 'outline'}
                                            className={partner.status === 'ACTIVE' ? 'bg-green-500 hover:bg-green-600' : partner.status === 'BUSY' ? 'bg-orange-500 hover:bg-orange-600' : ''}>
                                            {partner.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {partner.currentLocation ? (
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <MapPin className="h-3 w-3" /> {partner.currentLocation}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(partner)}>Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
