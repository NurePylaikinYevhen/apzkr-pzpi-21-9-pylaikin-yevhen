import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    IconButton,
    Grid,
    Collapse,
    Fade,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction, Snackbar, Alert,
} from '@mui/material';
import {
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {roomActions} from "../actions/roomActions";

const RoomCreationComponent = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const [roomName, setRoomName] = useState('');
    const [devices, setDevices] = useState([{ macAddress: '' }]);
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { createRoom } = roomActions();

    const handleAddRoom = () => {
        setStep(1);
    };

    const handleBack = () => {
        setStep(0);
        setRoomName('');
        setDevices([{ macAddress: '' }]);
    };

    const handleRoomNameChange = (event) => {
        setRoomName(event.target.value);
        setIsFormValid(event.target.value.trim() !== '');
    };

    const handleConfirm = () => {
        if (isFormValid) {
            setStep(2);
        }
    };

    const handleDeviceChange = (index, value) => {
        const newDevices = [...devices];
        newDevices[index].macAddress = value;
        setDevices(newDevices);
    };

    const handleAddDevice = () => {
        setDevices([...devices, { macAddress: '' }]);
    };

    const handleDeleteDevice = (index) => {
        const newDevices = devices.filter((_, i) => i !== index);
        setDevices(newDevices);
    };

    const handleSubmit = async () => {
        try {
            const roomData = {
                name: roomName,
                devices: devices.filter(device => device.macAddress.trim() !== '')
            };
            await createRoom(roomData);
            setSuccessMessage('Кімнату успішно створено');
            handleBack();
            onClose();
        } catch (error) {
            setError(`Помилка при створенні кімнати: ${error.message}`);
        }
    };

    // Валідація MAC-адреси
    const isValidMacAddress = (mac) => {
        return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setError(null);
        setSuccessMessage(null);
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                {step === 0 && (
                    <Fade in={step === 0}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            fullWidth
                            onClick={handleAddRoom}
                        >
                            Додати кімнату
                        </Button>
                    </Fade>
                )}

                {step > 0 && (
                    <Fade in={step > 0}>
                        <Box>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBack}
                                sx={{ mb: 2 }}
                            >
                                Назад
                            </Button>

                            <TextField
                                fullWidth
                                label="Введіть назву кімнати"
                                variant="outlined"
                                value={roomName}
                                onChange={handleRoomNameChange}
                                sx={{ mb: 2 }}
                            />

                            {step === 1 && (
                                <Fade in={step === 1}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleConfirm}
                                            disabled={!isFormValid}
                                        >
                                            Підтвердити
                                        </Button>
                                    </Box>
                                </Fade>
                            )}
                        </Box>
                    </Fade>
                )}

                <Collapse in={step === 2}>
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Додавання пристроїв
                        </Typography>
                        <List>
                            <AnimatePresence>
                                {devices.map((device, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ListItem>
                                            <ListItemText>
                                                <TextField
                                                    fullWidth
                                                    label="MAC-адреса пристрою"
                                                    value={device.macAddress}
                                                    onChange={(e) => handleDeviceChange(index, e.target.value)}
                                                    error={device.macAddress !== '' && !isValidMacAddress(device.macAddress)}
                                                    helperText={device.macAddress !== '' && !isValidMacAddress(device.macAddress) ? "Невірний формат MAC-адреси" : ""}
                                                />
                                            </ListItemText>
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteDevice(index)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </List>
                        <Button
                            startIcon={<AddIcon />}
                            onClick={handleAddDevice}
                            sx={{ mt: 2 }}
                        >
                            Додати пристрій
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={devices.some(device => !isValidMacAddress(device.macAddress))}
                        >
                            Створити кімнату та пристрої
                        </Button>
                    </Box>
                </Collapse>
            </Paper>
            <Snackbar open={!!error} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default RoomCreationComponent;
