const Order = require("../models/order");
const nodemailer = require("nodemailer");

exports.checkout = async (req, res) => {
  try {
    // Process the order (save to database, etc.)
    // Assuming req.body contains order details
    const order = new Order(req.body);
    await order.save();

    // Send confirmation email with button
    const transporter = nodemailer.createTransport({
      //configure the email service
      host: "sandbox.smtp.mailtrap.io",
      port: 2525, // or 465 or 587 or another Mailtrap port
      auth: {
        user: "fa59208cd93371",
        pass: "82bc14cd74667e",
      },
    });

    const mailOptions = {
      from: "munchiesandbevvies.com",
      to: "bevviesmunchies@gmail.com",
      subject: "New Order Confirmation",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
        </head>
        <body>
            <h1>New Order Confirmation</h1>
            <p>A new order has been placed. Please click the button below to confirm:</p>
            <a href="http://192.168.0.143:8000/confirm-order/${order._id}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Confirm Order</a>
        </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    // Respond with success message
    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ error: "Failed to process order" });
  }
};

exports.confirmOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Find the order in the database
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the order's verified field to true
    order.confirmed = true;
    await order.save();

    // Respond with success message
    res.status(200).json({ message: "Order confirmed successfully" });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ error: "Failed to confirm order" });
  }
};

exports.getOrdersByUser = async (req, res, next) => {
  try {
   
    const orders = await Order.find({ user: req.params.userId });

    if (!orders) {
      return res.status(404).json({
        success: false,
        message: "Orders not found",
      });
    }
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user');// Fetch all orders from the database

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ordersss",
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    // Extract the order ID from the request parameters
    const { orderId } = req.params;
    console.log(orderId)
    // Find the order by ID
    const order = await Order.findById(orderId);

    // If the order is not found, return 404 Not Found
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the status of the order to true
    order.status = true;

    // Save the updated order
    await order.save();

    // Return a success response
    return res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    console.log(req.params)
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

