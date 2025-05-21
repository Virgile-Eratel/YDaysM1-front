import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from "@mui/material";
import { useOwnerReservations, OwnerReservation } from "../hooks/useOwnerReservations";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PendingIcon from '@mui/icons-material/Pending';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function OwnerReservations() {
  const { reservations, stats, loading, error, fetchReservations, completeReservation, confirmReservation, cancelReservation } = useOwnerReservations();
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState<{open: boolean; message: string; severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCompleteReservation = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir marquer cette réservation comme terminée ?")) {
      const success = await completeReservation(id);
      if (success) {
        setNotification({
          open: true,
          message: 'Réservation marquée comme terminée avec succès.',
          severity: 'success'
        });
      }
    }
  };

  const handleConfirmReservation = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir valider cette réservation ?")) {
      const success = await confirmReservation(id);
      if (success) {
        setNotification({
          open: true,
          message: 'Réservation validée avec succès.',
          severity: 'success'
        });
      }
    }
  };

  const handleCancelReservation = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      const success = await cancelReservation(id);
      if (success) {
        setNotification({
          open: true,
          message: 'Réservation annulée avec succès.',
          severity: 'success'
        });
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const filteredReservations = (status?: string) => {
    if (!status) return reservations;
    return reservations.filter(res => res.status === status);
  };

  if (loading && reservations.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Gestion des réservations
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AttachMoneyIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6">{stats.totalRevenue.toFixed(2)} €</Typography>
                  <Typography variant="body2" color="text.secondary">Revenus totaux</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PendingIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6">{stats.pending}</Typography>
                  <Typography variant="body2" color="text.secondary">En attente</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6">{stats.confirmed}</Typography>
                  <Typography variant="body2" color="text.secondary">Confirmées</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DoneAllIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6">{stats.completed}</Typography>
                  <Typography variant="body2" color="text.secondary">Terminées</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="reservation tabs">
          <Tab label="Toutes" />
          <Tab label="En attente" />
          <Tab label="Confirmées" />
          <Tab label="Terminées" />
          <Tab label="Annulées" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <ReservationTable
            reservations={filteredReservations()}
            onComplete={handleCompleteReservation}
            onConfirm={handleConfirmReservation}
            onCancel={handleCancelReservation}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ReservationTable
            reservations={filteredReservations('pending')}
            onComplete={handleCompleteReservation}
            onConfirm={handleConfirmReservation}
            onCancel={handleCancelReservation}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <ReservationTable
            reservations={filteredReservations('confirmed')}
            onComplete={handleCompleteReservation}
            onConfirm={handleConfirmReservation}
            onCancel={handleCancelReservation}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <ReservationTable
            reservations={filteredReservations('completed')}
            onComplete={handleCompleteReservation}
            onConfirm={handleConfirmReservation}
            onCancel={handleCancelReservation}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <ReservationTable
            reservations={filteredReservations('cancelled')}
            onComplete={handleCompleteReservation}
            onConfirm={handleConfirmReservation}
            onCancel={handleCancelReservation}
          />
        </TabPanel>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

interface ReservationTableProps {
  reservations: OwnerReservation[];
  onComplete: (id: number) => void;
  onConfirm: (id: number) => void;
  onCancel: (id: number) => void;
}

function ReservationTable({ reservations, onComplete, onConfirm, onCancel }: ReservationTableProps) {
  const navigate = useNavigate();

  if (reservations.length === 0) {
    return (
      <Typography color="text.secondary" align="center" my={2}>
        Aucune réservation dans cette catégorie
      </Typography>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Logement</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Dates</TableCell>
            <TableCell>Personnes</TableCell>
            <TableCell>Prix</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {reservation.place.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {reservation.place.address}
                </Typography>
              </TableCell>
              <TableCell>{reservation.user.email}</TableCell>
              <TableCell>
                <Typography variant="body2">
                  {reservation.startDate} - {reservation.endDate}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Réservé le {reservation.createdAt}
                </Typography>
              </TableCell>
              <TableCell>{reservation.numberOfGuests}</TableCell>
              <TableCell>{reservation.totalPrice.toFixed(2)} €</TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(reservation.status)}
                  color={getStatusColor(reservation.status) as any}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box display="flex" gap={1} flexWrap="nowrap">
                  {reservation.status === 'pending' && (
                      <>
                        <Tooltip title="Valider la réservation">
                          <IconButton
                              color="success"
                              onClick={() => onConfirm(reservation.id)}
                              size="small"
                          >
                            <CheckCircleOutlineIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Annuler la réservation">
                          <IconButton
                              color="error"
                              onClick={() => onCancel(reservation.id)}
                              size="small"
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                  )}
                  {reservation.status === 'confirmed' && (
                      <>
                        <Tooltip title="Marquer comme terminée">
                          <IconButton
                              color="primary"
                              onClick={() => onComplete(reservation.id)}
                              size="small"
                          >
                            <DoneAllIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Annuler la réservation">
                          <IconButton
                              color="error"
                              onClick={() => onCancel(reservation.id)}
                              size="small"
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                  )}
                  <Tooltip title="Voir l'espace">
                    <IconButton
                        color="info"
                        onClick={() => navigate(`/place/${reservation.place.id}`)}
                        size="small"
                    >
                      <AttachMoneyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'confirmed':
      return 'Confirmée';
    case 'pending':
      return 'En attente';
    case 'cancelled':
      return 'Annulée';
    case 'completed':
      return 'Terminée';
    default:
      return status;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    case 'completed':
      return 'info';
    default:
      return 'default';
  }
}
