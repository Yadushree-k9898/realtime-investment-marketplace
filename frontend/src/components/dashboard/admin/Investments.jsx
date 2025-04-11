import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllInvestments,
  deleteInvestment,
} from '@/redux/slices/adminSlice';
import {
  Table, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const Investments = () => {
  const dispatch = useDispatch();
  const { investments, loading, error } = useSelector((state) => state.admin);

  const [selectedId, setSelectedId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllInvestments());
  }, [dispatch]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteInvestment(selectedId)).unwrap();
      toast.success('Investment deleted successfully');
    } catch (err) {
      toast.error(err || 'Failed to delete investment');
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Investments</h2>

      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Investor</TableCell>
              <TableCell>Proposal</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.map((inv) => (
              <TableRow key={inv._id}>
                <TableCell>{inv.investor?.name || 'N/A'}</TableCell>
                <TableCell>{inv.proposal?.title || 'N/A'}</TableCell>
                <TableCell>${inv.amount?.toLocaleString()}</TableCell>
                <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setSelectedId(inv._id);
                      setConfirmOpen(true);
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        title="Delete Investment"
        description="Are you sure you want to delete this investment? This action cannot be undone."
      />
    </div>
  );
};

export default Investments;
