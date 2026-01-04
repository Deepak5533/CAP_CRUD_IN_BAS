using demo as db from '../db/schema';

service CatalogService {
    entity Customers as projection on db.Customers{
        *,
        current_time as math:String
    };
}
