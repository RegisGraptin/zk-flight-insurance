#[derive(Copy, Drop, Serde)]
pub enum Premium {
    LessThan30Minutes,         // 0
    Between30And60Minutes,     // 30
    Between60And120Minutes,    // 50
    Over120MinutesOrCancelled, // 100
}

#[derive(Copy, Drop, Serde)]
pub enum Status { 
    Active, 
    Claimed 
}