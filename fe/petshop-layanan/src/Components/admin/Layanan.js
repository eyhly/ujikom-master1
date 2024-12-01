import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Card, Alert } from 'react-bootstrap';
import { BsBookmarkPlus, BsDoorOpen, BsPencil, BsTrash } from 'react-icons/bs';
import './Layanan.css';  
import logo from '../../assets/logo.png';
import icon from '../../assets/icon.png';

const Layanan = () => {
    const [services, setServices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newService, setNewService] = useState({ nama_layanan: '', deskripsi: '', harga: '' });
    const [editService, setEditService] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = () => {
        //ambil data dari server
        axios.get('http://localhost:3000/services')
            .then(response => {
                setServices(response.data);
            })
            .catch(error => {
                console.error('Ada masalah saat mengambil data!', error);
            });
    };

    //menampilkan modal untuk tambah data
    const handleShowModal = () => {
        setEditService(null); 
        setShowModal(true);
        setNewService({ nama_layanan: '', deskripsi: '', harga: '' });
        setErrors({});
    };

    //menutup modal ketika selesai input maupun edit
    const handleCloseModal = () => {
        setShowModal(false);
        setEditService(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewService({ ...newService, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!newService.nama_layanan || !/^[a-zA-Z\s]+$/.test(newService.nama_layanan)) { //untuk memastikan nama layanan berupa huruf dan spasi saja
            newErrors.nama_layanan = 'Nama layanan harus diisi dan hanya boleh mengandung huruf dan spasi.';
        }
        if (!newService.deskripsi) { ///deskripsi harus diisi
            newErrors.deskripsi = 'Deskripsi harus diisi!';
        }
        if (!newService.harga || isNaN(newService.harga)) { //harga harus berupa angka
            newErrors.harga = 'Harga harus diisi dan harus berupa angka.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateService = () => {
        if (!validateForm()) return;

        axios.post('http://localhost:3000/services', newService)
            .then(response => {
                fetchServices();
                handleCloseModal();
            })
            .catch(error => {
                console.error('Terjadi kesalahan saat membuat Layanan!', error);
            });
    };

    //menampilkan modal untuk edit data
    const handleEditService = (service) => {
        setEditService(service);
        setNewService(service);
        setShowModal(true);
        setErrors({});
    };

    //mengirimkan data baru yang sudah diediit
    const handleUpdateService = () => {
        if (!validateForm()) return;

        axios.put(`http://localhost:3000/services/${editService.id}`, newService)
            .then(response => {
                fetchServices();
                handleCloseModal();
            })
            .catch(error => {
                console.error('There was an error updating the service!', error);
            });
    };

    //mengirimkan data yang selesai diedit
    const handleDeleteService = (id) => {
        axios.delete(`http://localhost:3000/services/${id}`)
            .then(response => {
                fetchServices();
            })
            .catch(error => {
                console.error('There was an error deleting the service!', error);
            });
        setDeleteConfirmation(null);
    };

    const confirmDelete = (service) => {
        setDeleteConfirmation(service);
    };

    const cancelDelete = () => {
        setDeleteConfirmation(null);
    };

    const handleLogout = () => {
        setIsLoading(true); 
        setTimeout(() => {
            localStorage.removeItem("userToken");
            navigate("/");
            setIsLoading(false); 
        }, 2000);
    };

    return (
        <div className="background">
            <nav className="navbar">
                <h1><img src={logo} alt="My Logo" width={'10%'} />Admin Layanan Pet Shop</h1>
                <button className="btn btn-danger btn-sm" onClick={handleLogout} style={{ width: 130, marginRight: 8 }}>
                       <BsDoorOpen/> {isLoading ? 'Sedang Keluar...' : 'Keluar'}
                    </button>
                </nav>
            
            <div className="container">
            <Button className=".add" onClick={handleShowModal}>
                    <BsBookmarkPlus /> Tambah Layanan Baru
                </Button>
                                
                <div className="row my-4">
                    {services.map(service => (
                        <div key={service.id} className="col-md-4 mb-4">
                            <Card className="service-card">
                                <Card.Body>
                                    <Card.Title>{service.nama_layanan}</Card.Title>
                                    <Card.Img variant="top" src={icon} alt="Service Icon" className="icon" />
                                    <Card.Text>{service.deskripsi}</Card.Text>
                                    <Card.Text>Rp. {service.harga}</Card.Text><br/>
                                    <div className="d-flex justify-content-center">
                                    <Button variant="warning" className="md-5" onClick={() => handleEditService(service)}>
                                        <BsPencil />
                                    </Button>
                                    <Button variant="danger" className="ml-0" onClick={() => confirmDelete(service)}>
                                        <BsTrash />
                                    </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editService ? 'Edit Layanan' : 'Tambah Layanan Baru'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formNamaLayanan">
                                <Form.Label>Nama Layanan</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nama_layanan"
                                    value={newService.nama_layanan}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.nama_layanan}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.nama_layanan}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formDeskripsi">
                                <Form.Label>Deskripsi</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="deskripsi"
                                    value={newService.deskripsi}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.deskripsi}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.deskripsi}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formHarga">
                                <Form.Label>Harga</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="harga"
                                    value={newService.harga}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.harga}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.harga}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={editService ? handleUpdateService : handleCreateService}>
                            {editService ? 'Update Layanan' : 'Tambah Layanan'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={deleteConfirmation !== null} onHide={cancelDelete}>
                    <Modal.Header closeButton>
                        <Modal.Title>Konfirmasi Hapus Layanan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Apakah Anda yakin ingin menghapus layanan <strong>{deleteConfirmation && deleteConfirmation.nama_layanan}</strong>?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={cancelDelete}>
                            Batal
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteService(deleteConfirmation.id)}>
                            Hapus
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            
        </div>
    );
};

export default Layanan;
