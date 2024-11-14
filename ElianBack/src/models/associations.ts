import Cliente from './Cliente';
import Orden from './Orden';
import Pedido from './Pedido';
import Plato from './Plato';

// Definición de relaciones
Cliente.hasMany(Orden, { foreignKey: 'clienteId' }); // Un cliente tiene muchas órdenes
Orden.belongsTo(Cliente, { foreignKey: 'clienteId' }); // Una orden pertenece a un cliente

Orden.hasMany(Pedido, { foreignKey: 'ordenId' }); // Una orden tiene muchos pedidos
Pedido.belongsTo(Orden, { foreignKey: 'ordenId' }); // Un pedido pertenece a una orden

Plato.hasMany(Pedido, { foreignKey: 'platoId' }); // Un plato puede estar en muchos pedidos
Pedido.belongsTo(Plato, { foreignKey: 'platoId' }); // Un pedido puede incluir un plato
