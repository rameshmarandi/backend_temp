import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.modle.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({
      validateBeforeSave: false, // Don't validate the model before saving
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token and refresh token"
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  //    All steps
  // Check all fields from frontend
  // Validate the email filed
  // Check user already is exists by email & username in DB
  // Check Avatar is coming or not from the backed
  // Upload the avatar and coverImage on cloudinary
  // create user object in DB
  //remove the password and refreshToken field from the user object
  // return user created successfully response to the frontend

  const { fullName, username, email, password } = req.body;

  if (
    ["fullName", "username", "email", "password"].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const isUserAlreadyExists = await User.findOne({
    $or: [
      {
        email,
      },
      {
        username,
      },
    ],
  });

  if (isUserAlreadyExists) {
    throw new ApiError(409, "User already exists with this email or username");
  }

  // return
  const avatarLocalPath = req.files?.avatar[0].path;
  let coverImageLocalPath = "";

  if (
    req.files?.coverImage &&
    Array.isArray(req.files?.coverImage) &&
    req.files?.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files?.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required!");
  }

  const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
  const coverImageUrl = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatarUrl) {
    throw new ApiError(400, "Avatar file is required!");
  }
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatarUrl?.url,
    coverImage: coverImageUrl?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //    All steps
  // Accept all the fields from frontend
  // Check user is exists by email & username in DB
  // Check password is correct
  // generate the access token and refresh token
  // send secure cookies

  const { email, username, password } = req.body;

  if (email == "" || username == "") {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({
    $or: [
      {
        email,
      },
      {
        username,
      },
    ],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invlaid cradentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) // For website we are send the cookies to the frontend
    .cookie("refreshToken", refreshToken, options) // For website we are send the cookies to the frontend
    .json( // WE are sending the json for the Mobile app, because there is not cookies functionlaty in the frontend
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Login successfully"
      )
    );
});

const userLogout = asyncHandler(async (req, res) => {

  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      refreshToken:undefined,
    }, {
      new : true
    })
  
    const options = {
      httpOnly: true,
      secure: true,
    };
  
  
    return res.status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200, {}, "Logout successfully"))
    
  } catch (error) {
    throw new ApiError(500, "Something went wrong while logging out")
  }
})
export { registerUser, loginUser , userLogout };
