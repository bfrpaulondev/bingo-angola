import React, { useEffect, useState } from 'react';
import {
  Box, Stack, Typography, Paper, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, TextField, MenuItem, List, ListItem, ListItemText, Tooltip, Chip, useMediaQuery, CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useLang } from '@/contexts/LanguageContext';

// Traduções
const messages = {
  pt: {
    contactsTitle: 'Mensagens de Contato',
    shipmentsTitle: 'Gestão de Encomendas',
    selectUser: 'Selecionar usuário (e-mail)',
    selectUserOption: 'Selecione',
    newShipment: 'Nova Encomenda',
    editShipment: 'Editar Encomenda',
    deleteShipment: 'Excluir Encomenda?',
    deleteConfirm: 'Tem certeza que deseja excluir',
    cancel: 'Cancelar',
    save: 'Salvar',
    added: 'Encomenda adicionada.',
    updated: 'Status atualizado.',
    deleted: 'Encomenda excluída.',
    codeLabel: 'Código da encomenda',
    statusLabel: 'Status',
    seeMessage: 'Ver mensagem',
    edit: 'Editar',
    remove: 'Excluir',
    selectToManage: 'Selecione um usuário para gerenciar encomendas.',
    contactMessage: 'Mensagem de contato',
    yes: 'Excluir',
  },
  en: {
    contactsTitle: 'Contact Messages',
    shipmentsTitle: 'Shipment Management',
    selectUser: 'Select user (e-mail)',
    selectUserOption: 'Select',
    newShipment: 'New Shipment',
    editShipment: 'Edit Shipment',
    deleteShipment: 'Delete Shipment?',
    deleteConfirm: 'Are you sure you want to delete',
    cancel: 'Cancel',
    save: 'Save',
    added: 'Shipment added.',
    updated: 'Status updated.',
    deleted: 'Shipment deleted.',
    codeLabel: 'Tracking code',
    statusLabel: 'Status',
    seeMessage: 'View message',
    edit: 'Edit',
    remove: 'Delete',
    selectToManage: 'Select a user to manage shipments.',
    contactMessage: 'Contact message',
    yes: 'Delete',
  },
};

// Status disponíveis multilíngue
const STATUS_OPTIONS = [
  { value: 'pending',    label: { pt: 'Aguardando envio', en: 'Pending dispatch' },   color: '#ffb300'   },
  { value: 'transit',    label: { pt: 'Em trânsito',      en: 'In transit' },         color: '#29b6f6'   },
  { value: 'delivered',  label: { pt: 'Entregue',         en: 'Delivered' },          color: '#66bb6a'   },
  { value: 'contact',    label: { pt: 'Pendência',        en: 'Contact needed' },     color: '#ef5350'   },
];

// MOCKS - substitua pelas APIs reais
const MOCK_CONTACTS = [
  { id: 1, name: 'João Silva', email: 'joao@email.com', message: 'Gostaria de saber sobre minha entrega.', date: '2025-06-15' },
  { id: 2, name: 'Ana Costa', email: 'ana@email.com', message: 'Meu pedido não chegou ainda.', date: '2025-06-16' },
];
const MOCK_USERS = [
  {
    email: 'joao@email.com',
    shipments: [
      { id: 101, code: 'BR123456789PT', status: 'pending' },
      { id: 102, code: 'BR111111111PT', status: 'transit' },
    ]
  },
  {
    email: 'ana@email.com',
    shipments: [
      { id: 201, code: 'BR987654321PT', status: 'contact' },
    ]
  }
];

export default function AdminPage() {
  const { lang } = useLang();
  const t = (k) => messages[lang][k];
  const isSmall = useMediaQuery('(max-width:600px)');

  const [contacts, setContacts] = useState([]);
  const [contactView, setContactView] = useState(null);

  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const [editDialog, setEditDialog] = useState({ open: false, shipment: null });
  const [addDialog, setAddDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, shipment: null });
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    setContacts(MOCK_CONTACTS);
    setUsers(MOCK_USERS);
  }, []);

  useEffect(() => {
    setSelectedUser(users.find(u => u.email === selectedEmail) || null);
  }, [selectedEmail, users]);

  const updateUserShipments = (shipments) => {
    setUsers(users.map(u => u.email === selectedEmail ? { ...u, shipments } : u));
  };

  const handleAdd = (data) => {
    const newShipment = { id: Date.now(), code: data.code, status: data.status };
    updateUserShipments([...selectedUser.shipments, newShipment]);
    setAddDialog(false);
    setSnack({ open: true, msg: t('added'), severity: 'success' });
  };
  const handleEdit = (data) => {
    updateUserShipments(selectedUser.shipments.map(s => s.id === data.id ? data : s));
    setEditDialog({ open: false, shipment: null });
    setSnack({ open: true, msg: t('updated'), severity: 'success' });
  };
  const handleDelete = (shipment) => {
    updateUserShipments(selectedUser.shipments.filter(s => s.id !== shipment.id));
    setDeleteDialog({ open: false, shipment: null });
    setSnack({ open: true, msg: t('deleted'), severity: 'success' });
  };

  const getStatusLabel = (status) => {
    const found = STATUS_OPTIONS.find(s => s.value === status);
    return found ? found.label[lang] : status;
  };
  const getStatusColor = (status) => {
    const found = STATUS_OPTIONS.find(s => s.value === status);
    return found ? found.color : undefined;
  };

  return (
    <Stack direction={isSmall ? 'column' : 'row'} spacing={4} sx={{ minHeight: '85vh', px: 2, pt: 4 }}>
      {/* Painel de mensagens */}
      <Paper elevation={5} sx={{ flex: 1, p: isSmall ? 2 : 3, minWidth: isSmall ? 280 : 320, overflow: 'auto' }}>
        <Typography variant="h6" color="primary" mb={2}>{t('contactsTitle')}</Typography>
        <List dense>
          {contacts.map(c => (
            <ListItem key={c.id} alignItems="flex-start" divider sx={{ py: 1 }}>
              <ListItemText
                primary={c.name}
                secondary={
                  <>
                    <span>{c.email}</span>
                    <br />
                    <span style={{ fontSize: 13 }}>{c.date}</span>
                  </>
                }
              />
              <Stack
                direction={isSmall ? 'column' : 'row'}
                spacing={isSmall ? 1 : 2}
                alignItems="center"
                justifyContent="flex-end"
              >
                <Tooltip title={t('seeMessage')}>
                  <IconButton edge="end" onClick={() => setContactView(c)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Painel de encomendas por usuário */}
      <Paper elevation={5} sx={{ flex: 2, p: isSmall ? 2 : 4 }}>
        <Typography variant="h6" color="primary" mb={2}>{t('shipmentsTitle')}</Typography>
        <TextField
          select
          label={t('selectUser')}
          value={selectedEmail}
          onChange={e => setSelectedEmail(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 3, maxWidth: 340 }}
        >
          <MenuItem value="">{t('selectUserOption')}</MenuItem>
          {users.map(u => (
            <MenuItem key={u.email} value={u.email}>{u.email}</MenuItem>
          ))}
        </TextField>
        {selectedUser ? (
          <>
            <Stack direction="row" justifyContent={isSmall ? "center" : "flex-start"} mb={2}>
              <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={() => setAddDialog(true)}>
                {t('newShipment')}
              </Button>
            </Stack>
            <List>
              {selectedUser.shipments.map(shipment => (
                <ListItem key={shipment.id} divider sx={{ px: 0 }}>
                  <Stack direction={isSmall ? 'column' : 'row'} alignItems="center" justifyContent='space-between' spacing={2} sx={{ width: '100%' }}>
                    <Chip label={shipment.code} color="info" sx={{ fontWeight: 700, minWidth: 120 }} />
                    <Chip
                      label={getStatusLabel(shipment.status)}
                      color="secondary"
                      sx={{
                        fontWeight: 500,
                        minWidth: 140,
                        bgcolor: getStatusColor(shipment.status),
                        color: "#fff"
                      }}
                    />
                    <Stack direction='row' spacing={1} sx={{ ml: 'auto' }}>
                      <Tooltip title={t('edit')}>
                        <IconButton size="small" onClick={() => setEditDialog({ open: true, shipment })}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('remove')}>
                        <IconButton size="small" onClick={() => setDeleteDialog({ open: true, shipment })}>
                          <DeleteIcon color="error" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary" mt={4}>{t('selectToManage')}</Typography>
        )}
      </Paper>

      {/* Modal visualizar mensagem */}
      <Dialog open={!!contactView} onClose={() => setContactView(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('contactMessage')}
          <IconButton onClick={() => setContactView(null)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {contactView && (
            <>
              <Typography variant="subtitle2" color="primary">{contactView.name} — {contactView.email}</Typography>
              <Typography variant="body2" mt={2}>{contactView.message}</Typography>
              <Typography variant="caption" mt={2} display="block">{contactView.date}</Typography>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal adicionar encomenda */}
      <Dialog open={!!addDialog} onClose={() => setAddDialog(false)} maxWidth="xs" fullWidth >
        <DialogTitle>{t('newShipment')}</DialogTitle>
        <DialogContent dividers>
          <AddEditShipmentForm
            lang={lang}
            onSubmit={handleAdd}
            onCancel={() => setAddDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal editar encomenda */}
      <Dialog open={!!editDialog.open} onClose={() => setEditDialog({ open: false, shipment: null })} maxWidth="xs" fullWidth>
        <DialogTitle>{t('editShipment')}</DialogTitle>
        <DialogContent dividers>
          <AddEditShipmentForm
            lang={lang}
            initial={editDialog.shipment}
            onSubmit={handleEdit}
            onCancel={() => setEditDialog({ open: false, shipment: null })}
          />
        </DialogContent>
      </Dialog>

      {/* Modal excluir encomenda */}
      <Dialog open={!!deleteDialog.open} onClose={() => setDeleteDialog({ open: false, shipment: null })} maxWidth="xs" fullWidth>
        <DialogTitle>{t('deleteShipment')}</DialogTitle>
        <DialogContent dividers>
          <Typography>{t('deleteConfirm')} <b>{deleteDialog.shipment?.code}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, shipment: null })}>{t('cancel')}</Button>
          <Button color="error" variant="contained" onClick={() => handleDelete(deleteDialog.shipment)}>
            {t('yes')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Stack>
  );
}

// Formulário de adicionar/editar encomenda
function AddEditShipmentForm({ lang, initial, onSubmit, onCancel }) {
  const [code, setCode] = useState(initial?.code || '');
  const [status, setStatus] = useState(initial?.status || STATUS_OPTIONS[0].value);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      onSubmit({ ...(initial || {}), code, status });
      setSaving(false);
    }, 700); // simula um delay
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} mt={1}>
        <TextField
          label={lang === 'pt' ? 'Código da encomenda' : 'Tracking code'}
          value={code}
          onChange={e => setCode(e.target.value)}
          required
          disabled={saving}
        />
        <TextField
          label={lang === 'pt' ? 'Status' : 'Status'}
          select
          value={status}
          onChange={e => setStatus(e.target.value)}
          required
          disabled={saving}
        >
          {STATUS_OPTIONS.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label[lang]}
            </MenuItem>
          ))}
        </TextField>
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button onClick={onCancel} disabled={saving}>{lang === 'pt' ? 'Cancelar' : 'Cancel'}</Button>
          <Button type="submit" variant="contained" color="primary" disabled={saving}>
            {saving ? <CircularProgress size={20} /> : (lang === 'pt' ? 'Salvar' : 'Save')}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
