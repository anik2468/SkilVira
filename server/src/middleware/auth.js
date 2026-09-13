import jwt from "jsonwebtoken";


// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const auth = async (req, res, next) => {

  try {

    // =========================================
    // GET TOKEN
    // =========================================

    let token = null;


    // Authorization: Bearer <token>
    const authHeader =
      req.headers.authorization;


    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {

      token =
        authHeader.split(" ")[1];

    }


    // Optional cookie support
    if (
      !token &&
      req.cookies?.token
    ) {

      token =
        req.cookies.token;

    }


    if (!token) {

      return res.status(401).json({

        success:
          false,

        message:
          "Authentication required. Please login.",

      });

    }


    // =========================================
    // VERIFY TOKEN
    // =========================================

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // =========================================
    // ATTACH USER TO REQUEST
    // =========================================

    req.user = decoded;


    next();


  } catch (error) {

    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error
    );


    if (
      error.name ===
      "TokenExpiredError"
    ) {

      return res.status(401).json({

        success:
          false,

        message:
          "Authentication token has expired. Please login again.",

      });

    }


    return res.status(401).json({

      success:
        false,

      message:
        "Invalid authentication token.",

    });

  }

};


export default auth;