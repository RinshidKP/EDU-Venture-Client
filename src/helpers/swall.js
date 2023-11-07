import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export const showAdvancedAlert = () => {
    Swal.fire({
      title: 'Custom Alert',
      text: 'This is a custom alert with options',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('You clicked OK!', '', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('You clicked Cancel!', '', 'error');
      }
    });
  };
  