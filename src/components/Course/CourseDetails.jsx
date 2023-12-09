import { useState, useEffect } from 'react';
import defaultImage from '../../assets/download.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { showErrorToast, showToast, ToastContainer } from '../../helpers/toaster';
import Swal from 'sweetalert2';
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';
import { loadStripe } from '@stripe/stripe-js';
import ReactStarsRating from 'react-awesome-stars-rating';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Pencil, Trash2 } from 'lucide-react';
import EditReview from './EditReview';
import { format } from 'timeago.js';

const CourseDetails = () => {
  const navigate = useNavigate()
  const [course, setCourse] = useState(null);
  const { Id, Role, DisplayName } = useSelector((state) => state.User);
  const studentAxios = useStudentAxiosIntercepter();
  const location = useLocation();
  const [applied, setApplied] = useState(false);
  const [country, setCountry] = useState(null)
  const [value, setValue] = useState(1);
  const [reviewText, setReviewText] = useState('')
  const [application, setApplication] = useState({})
  const [certificate, setCertificate] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [editReview, setEditReview] = useState(false);
  const [editReviewModal, setEditReviewModal] = useState(false)

  useEffect(() => {

    if (location.state?.course) {
      setCourse(location.state?.course);
      console.log(location.state);
      setCountry(location.state?.course.countryInfo || location.state?.course.country)
      const countryToSet = location.state?.course.countryInfo || location.state?.course.country;
      setCountry(countryToSet);

    }
  }, [location]);

  useEffect(() => {
    studentAxios.get('/student_application', {
      params: {
        courseID: location.state?.course?._id,
        studentID: Id,
      }
    }).then((response) => {
      console.log('Applied', response);
      setApplied(response.data.applied);
      setApplication(response.data.applied[0]);
      setCertificate(response.data.certificate);
      setReviews(response.data.reviews);
      console.log('review', response.data);
    }).catch((error) => {
      console.log(error.response.data);
    })
  }, [location, Id])
  const handleApply = () => {

    Swal.fire({
      title: 'Confirm Application',
      text: 'Are you sure you want to apply for this course?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Apply',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const id = course._id;
        studentAxios
          .post('/apply_course', { id })
          .then((response) => {
            showToast(response.data.message);
            if (response.status === 200) {
              setApplication((prev) => ({ ...prev, status: 'Applied' }));
            }
          });
      }
    });
  };

  const handleRepply = () => {
    Swal.fire({
      title: 'Confirm Resubmission',
      text: 'Are you sure you want to Reapply for this course?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Reapply',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const id = application._id;
        studentAxios
          .post('/reapply_course', { id })
          .then((response) => {
            showToast(response.data.message);
            if (response.status === 200) {
              setApplication((prev) => ({ ...prev, status: 'Reapplied' }));
            }
          });
      }
    });
  }

  const makePayment = async () => {
    const stripe = await loadStripe('pk_test_51OHixDSJYia4uvqdHG3CLqt8yNNQyd7bmI9AXQDyLiriRwdHoMmlvqrJSDDdO27yuApUoPqY6Yh94KrYEfL1cCNt00qNJxd2Nj');
    console.log(application);
    studentAxios.post('/create_check_out', { application: location.state, id: application._id })
      .then((response) => {
        const result = stripe.redirectToCheckout({ sessionId: response.data.id });
        console.log(result);
        if (result.error) {
          console.log(result);
          navigate('/course_details/cancel', { state: { result } })
        }
        studentAxios.post('/checkout_success', { id: application._id, sessionId: response.data.id, result })
          .catch((error) => {
            console.log(error);
          })

      })
  }

  // Ratings

  const onChange = (value) => {
    setValue(value)
  };

  const handleCommentChange = (e) => {
    setReviewText(e.target.value)
  }

  const submitReview = () => {
    console.log(value, reviewText);

    const trimmedReviewText = reviewText.trim();
    const words = trimmedReviewText.split(/\s+/);

    if (words.length < 5) {
      showErrorToast('Review should be at least 5 words');
      return;
    }

    Swal.fire({
      title: 'Confirm Submission',
      text: 'Are you sure you want to submit this review?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        studentAxios.post('/create_a_review', {
          text: reviewText,
          rating: value,
          student_id: Id,
          course_id: location.state.course._id,
        })
          .then((response) => {
            if (response.status === 200) {
              Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
              });
              setReviews((prevReviews) => {
                return prevReviews ? [...prevReviews, response.data.review] : [response.data.review];
              });
              setValue(1);
              setReviewText('');
            } else {
              Swal.fire({
                title: 'Something happened!',
                text: response.data.message,
                icon: 'error',
              })
            }

          })
          .catch((error) => {
            Swal.fire({
              title: 'Something happened!',
              text: 'Something happened While Submitting',
              icon: 'error',
            })
            console.log(error)
          })

      }
    });
  }

  const handleEditReview = (review, index) => {
    review.index = index
    setEditReview(review);
    setEditReviewModal(true)
  }
  const onColseReviewModal = () => {
    setEditReviewModal(false)
  }

  const handleEditSubmit = (updateReview, review) => {
    if (updateReview.text) {
      const trimmedReviewText = updateReview.text.trim();
      const words = trimmedReviewText.split(/\s+/);

      if (words.length < 5) {
        showErrorToast('Review should be at least 5 words');
        return;
      }
    }
    console.log(updateReview, review);
    Swal.fire({
      title: 'Confirm Submission',
      text: 'Are you sure you want to update this review?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        onColseReviewModal()
        const newReview = {
          text: updateReview.text,
          rating: updateReview.rating,
          student_id: Id,
          course_id: location.state.course._id,
        }

        studentAxios.post('/update_review',
          {
            newReview,
            reviewId: review._id
          })
          .then((response) => {
            if (response.status === 200) {
              setReviews((prevReviews) =>
                prevReviews.map((review) =>
                  review._id === response.data.review._id ? response.data.review : review
                )
              );

              Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
              });
            } else {
              Swal.fire({
                title: 'Something happened!',
                text: response.data.message,
                icon: 'error',
              })
            }
          }).catch((error) => {
            Swal.fire({
              title: 'Something happened!',
              text: 'Something happened While Submitting',
              icon: 'error',
            })
            console.log(error)
          })
      }
    });
  }

  const handleDeleteReview = (review, index) => {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this review?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {

        studentAxios.delete('/delete_review', { params: { reviewId: review._id } })
          .then((response) => {
            if (response.status === 200) {
              Swal.fire({
                title: 'Deleted!',
                text: response.data.message,
                icon: 'success',
              });

              setReviews((prevReviews) => prevReviews.filter((_, i) => i !== index));
            } else {
              console.log(response)
              Swal.fire({
                title: 'Something happened!',
                text: response.data.message,
                icon: 'error',
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: 'Something happened!',
              text: 'Something happened while deleting the review',
              icon: 'error',
            });
            console.log(error);
          });
      }
    });
  };


  return (
    <div className="">

      <nav style={{ backgroundColor: '#F3F8F9' }} className="cursor-pointer dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="border p-1 ">
            <div className="flex items-center justify-center p-6 text-dark-600 capitalize dark:text-gray-300">
              <h1 className='text-2xl'>Course Details</h1>
            </div>
          </div>
        </div>
      </nav>
      <div className="w-full max-w-screen-xl  mx-auto py-10  p-6 bg-white rounded-md ">
        {course ? (
          <div className="flex w-full justify-center md:flex-row">
            <div className='w-5/6 flex bg-white shadow-2xl rounded-lg justify-content-center'>
              <div className="flex flex-col md:flex-row w-full justify-center">
                {/* Left Section */}
                <div className="w-full md:w-3/5 pr-6">
                  <div className="text-center ">
                    <h1 className="text-3xl capitalize my-5  font-semibold text-gray-800 mb-4">{course.header}</h1>
                    <div className="m-10">
                      <img
                        className="rounded-lg shadow-lg mx-auto w-full object-cover object-center border-4 border-gray-300"
                        src={course.course_image ? course.course_image.url : defaultImage}
                        alt="Course Image"
                      />
                    </div>
                  </div>
                  { application && application?.paymentStatus === 'Initiated' && (
                    <div className="flex w-full justify-center my-3 ">
                      <div className="border flex justify-evenly items-center w-full border-sky-600 rounded-lg mx-5 py-2 px-1">
                        <p className="my-3 capitalize">{course.creator?.consultancy_name || 'Consultant'} Has Requested Payment</p>
                        <div className="my-3">
                          <button onClick={makePayment} className="px-5 py-3 bg-emerald-500 text-white rounded-lg">
                            Pay Now
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Section */}
                <div className="flex md:w-2/5 mx-auto justify-center">
                  <div className="flex flex-1 flex-col justify-center text-center md:text-start">
                    <div className="mt-4 mx-auto items-start">
                      {/* Column 1 */}
                      <div className="items-start ">
                        <div className="items-start">
                          <p className="text-lg text-gray-600">Consultancy</p>
                          <p className="text-2xl text-green-600 capitalize font-semibold">
                            {course.creator?.consultancy_name}
                          </p>
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div className="items-start flex justify-between ">
                        <div className="">
                          <p className="text-lg text-gray-600">Country</p>
                          <p className="text-2xl text-green-600 flex justify-between items-center capitalize font-semibold">
                            {country.name}
                          </p>
                        </div>
                        <img className="object-cover mt-9 object-center mx-auto w-5 h-5 rounded-full" src={country?.image.url} alt="" />
                      </div>

                      {/* Column 3 */}
                      <div className="  mt-4 md:mt-0">
                        <div className="text-center md:text-start ">
                          <p className="text-lg text-gray-600 text-ellipsis">Course Fee</p>
                          <p className="text-2xl text-green-600 font-semibold">₹{course.fee}</p>
                        </div>
                      </div>
                      {application?.status === 'Rejected' && (
                        <div className="text-ellipsis text-blue-600 mt-2">Try reapplying after Proper Documentation.</div>
                      )}
                      {/* Apply Button */}
                      <div className="flex items-start justify-center my-6">
                        {certificate && application?.status === 'Rejected'
                          ? (<button
                            onClick={handleRepply}
                            disabled={Role === 'consultant'}
                            className={`mx-start py-2 px-3 md:px-10 font-semibold rounded text-white
                          ${application?.status === 'Rejected' ? 'bg-red-500' : 'bg-emerald-500'}`}
                          >
                            {application?.status === 'Reapplied' ? 'Reapplied' : 'Reapply'}
                          </button>)
                          : (
                            <button
                              onClick={handleApply}
                              disabled={applied !== false || Role === 'consultant'}
                              className={`mx-start py-2 px-3 md:px-10 font-semibold rounded text-white
                          ${application?.status === 'Rejected' ? 'bg-red-500' : 'bg-emerald-500'}`}
                            >
                              {application?.status || 'Apply'}
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>


        ) : (
          <div className="flex justify-center">
            <p className="my-auto text-2xl text-gray-800">Loading course details...</p>
          </div>
        )}

        {/* Other contents below the image and header */}
        <div className="mt-6">
          <div className="text-center ">
            <h2 className="text-2xl underline capitalize text-gray-600">Students Qualification</h2>
            <p className="text-gray-800">{course?.students_qualification_header}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-center ">
            <p className="text-gray-800">{course?.qualification_description}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-center ">
            <h2 className="text-2xl underline capitalize text-gray-600">Requirements</h2>
            <p className="text-gray-800">{course?.requirements_header}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-center ">
            <h2 className="text-2xl underline capitalize text-gray-600">Requirements Description</h2>
            <p className="text-gray-800">{course?.requirements_blob}</p>
          </div>
        </div>

      </div>
      {/* Edit Review */}
      {editReviewModal && <EditReview review={editReview} onSubmit={handleEditSubmit} onClose={onColseReviewModal} />}
      {/* Review Create */}
      <div className='w-full p-10 ' >
        <div>
          <h2 className='w-full my-10 flex justify-center underline text-2xl font-bold' >Reviews</h2>
        </div>

        {application?.status === 'Accepted' ? (
          <>
            <div className='flex flex-col items-start'>
              <div className='flex flex-row justify-start my-5 ' >
                <h3 className='mx-4 text-xl' >{DisplayName || 'user_name'}</h3>
                <ReactStarsRating className={'flex flex-row items-center'} onChange={onChange} value={value} />
              </div>
              <div className=' w-full' >
                <div className=' ' >
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    onChange={handleCommentChange}
                    className='w-full mx-4'
                    placeholder="Enter your text here..."
                    style={{ width: '100%', resize: 'both' }}
                  />
                </div>
              </div>
            </div>

            <div className='flex items-center justify-center' >
              <button
                className='mx-start py-2 px-3 md:px-10 font-semibold rounded text-white bg-emerald-500 hover:bg-emerald-600'
                onClick={submitReview} >
                Submit
              </button>
            </div>
          </>
        ) : (
          <div className='w-full p-10 ' >
            <div className='flex flex-col items-start'>
              <div className='flex flex-row justify-start my-5 ' >
                <h3 className='mx-4 text-xl' >{DisplayName || 'user_name'}</h3>
                <ReactStarsRating className={'flex flex-row items-center'} value={5} />
              </div>
            </div>
            <div className=' w-full' >
              <div className='px-10 py-5 text-gray-500' >
                <h3>Purchase the course to Add Your Review</h3>
              </div>
            </div>
          </div>)}
        {/* List Reviews */}
        {reviews?.length >= 0 ? (
          <div className='w-full px-10' >
            {reviews.map((review, index) => (
              <div key={index} className='my-10 px-5 border border-gray-400 rounded-lg' >
                <div className='flex flex-row justify-start my-5'>
                  <div className='flex justify-between' >
                    <h3 className='mx-4 text-xl underline'>{review?.student_id?.full_name || DisplayName || 'user_name'}</h3>
                    <ReactStarsRating className={'flex flex-row items-center'} value={review?.rating || 2.5} />
                  </div>
                  <div className='my-auto' >
                    <span className='mx-2' >{format(review.createdAt)}</span>
                  </div>
                  {Id === review?.student_id?._id && (
                    <div className='flex' >
                      <Pencil onClick={() => handleEditReview(review, index)} className='mx-2 text-gray-500 my-auto hover:text-black' size={18} strokeWidth={0.75} />
                      <Trash2 onClick={() => handleDeleteReview(review, index)} className='mx-2 text-red-500 my-auto hover:text-red-900' size={18} strokeWidth={1} />
                    </div>

                  )}

                </div>
                <div className='w-full'>
                  <div className='py-2 pl-2'>
                    <p>{review?.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}

      </div>
      <ToastContainer />
    </div>

  );
};

export default CourseDetails;
