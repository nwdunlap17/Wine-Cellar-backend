class CreateWines < ActiveRecord::Migration[6.0]
  def change
    create_table :wines do |t|
      t.integer :year
      t.double :price
      t.string :type
      t.string :origin
      t.string :name

      t.timestamps
    end
  end
end
