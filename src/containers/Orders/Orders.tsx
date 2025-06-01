import { OrderSummary } from "../../components/OrderSummary";
import { handleValidateSuperAdmin } from "../../utils/validateRole";
import { OrderItem } from "../../components/OrderItem";
import classes from "./Orders.module.scss";
import { useOrder } from "../../hooks/useOrder";

export const Orders: React.FC = () => {
 const {user, orders, loading, error} = useOrder();

  if (!user) {
    return null;
  }

  if (loading) {
    return <div data-testid="loading-id" className={classes.orders__loading}>Loading orders...</div>;
  }

  if (error) {
    return <div className={classes.orders__error}>{error}</div>;
  }

  const isSuperAdmin = handleValidateSuperAdmin(user.role);

  return (
    <section data-testid="orders-container" className={classes.orders}>
      <div className={classes.orders__container}>
        <h2 className={classes.orders__title}>Order History</h2>
        {isSuperAdmin && <OrderSummary orders={orders} />}
        <div className={classes.orders__list}>
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      </div>
    </section>
  );
};
