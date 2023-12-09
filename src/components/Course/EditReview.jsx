import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useState } from 'react';
import ReactStarsRating from 'react-awesome-stars-rating';

const EditReview = ({ review, onSubmit, onClose }) => {
    const [updateReview, setUpdateReview] = useState({
        rating: review.rating,
        text: review.text
    })

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex flex-col items-start">
                            <div className="flex flex-row justify-start my-5">
                                <h3 className="mx-4 text-xl">{review.student_id.full_name || 'user_name'}</h3>
                                <ReactStarsRating
                                    className={'flex flex-row items-center'}
                                    onChange={(value) => setUpdateReview((prev) => ({ prev, rating: value }))}
                                    value={updateReview.rating}
                                />
                            </div>
                            <div className="w-full">
                                <div className="">
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        placeholder={review?.text}
                                        onChange={(e) => setUpdateReview((prev) => ({ ...prev, text: e.target.value }))}
                                        className="w-full mx-4"
                                        style={{ width: '100%', resize: 'both' }}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            onClick={() => onSubmit(updateReview, review)}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-500 text-base font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Submit
                        </button>
                        <button
                            onClick={onClose}
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditReview;
